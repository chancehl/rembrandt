import { PrismaClient, Subscription } from '@prisma/client'
import { EmbedBuilder, TextChannel } from 'discord.js'
import cron from 'node-cron'
import dayjs from 'dayjs'

import { botClient } from '../../clients'
import { EmbedService } from '../embedService'
import { MetCollectionService } from '../metCollectionService'
import { logger } from '../../logger'
import { SummaryService } from '../summaryService'

export const PUSH_SERVICE_CRON_JOB = '0 * * * *'

export class PushService {
    private dbClient: PrismaClient

    constructor() {
        this.dbClient = new PrismaClient()
    }

    async scheduleUpdates() {
        cron.schedule(PUSH_SERVICE_CRON_JOB, async () => {
            const next = dayjs().add(1, 'hour').unix()

            logger.info(`Sending updates. Next execution at ${new Date(next).toISOString()}.`)

            await this.sendUpdates()
        })
    }

    async sendUpdates() {
        const now = dayjs()

        const metCollectionService = new MetCollectionService()
        const embedService = new EmbedService({ builder: new EmbedBuilder() })
        const summaryService = new SummaryService()

        const updates = await this.dbClient.subscription.findMany({
            where: {
                active: true,
                next: {
                    gt: now.unix(),
                    lt: now.add(1, 'hour').unix(),
                },
            },
        })

        logger.info(`Found ${updates.length} guilds scheduled to receive updates: ${updates.length ? updates.map((update: Subscription) => update.guild).join(', ') : 'N/A'}`)

        const object = await metCollectionService.getRandomCollectionObject()
        const summary = await summaryService.generateSummary(object)
        const embed = embedService.create(object)

        const sendAndUpdatePromises = updates.map((update: Subscription) => {
            return new Promise(async (resolve, reject) => {
                logger.info(`Sending daily update to guild ${update.guild} (channel = ${update.channel})`)

                const channel = await botClient.channels.fetch(update.channel)

                if (channel == null) {
                    reject('Missing channel')
                } else {
                    const textChannel = channel as TextChannel

                    // send update
                    await textChannel.send({ embeds: [embed], content: summary })

                    // update element in db
                    await this.dbClient.subscription.update({
                        data: {
                            lastSent: now.unix(),
                            next: now.add(1, 'day').unix(),
                        },
                        where: {
                            channel: update.channel,
                        },
                    })

                    // resolve
                    resolve(update.next)
                }
            })
        })

        await Promise.all(sendAndUpdatePromises)
    }
}
