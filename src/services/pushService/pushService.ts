import { PrismaClient, Subscription } from '@prisma/client'
import { EmbedBuilder, TextChannel } from 'discord.js'
import cron from 'node-cron'

import { botClient } from '../../clients'
import { DAY_INTERVAL, HOUR_INTERVAL } from '../../constants'
import { EmbedService } from '../embedService'
import { MetCollectionService } from '../metCollectionService'
import { logger } from '../../logger'

export const PUSH_SERVICE_CRON_JOB = '0 * * * *'

export class PushService {
    private dbClient: PrismaClient

    constructor() {
        this.dbClient = new PrismaClient()
    }

    async scheduleUpdates() {
        cron.schedule(PUSH_SERVICE_CRON_JOB, async () => {
            logger.info(`Sending updates. Next execution at ${new Date(Date.now() + HOUR_INTERVAL).toISOString()}.`)

            await this.sendUpdates()
        })
    }

    async sendUpdates() {
        const metCollectionService = new MetCollectionService()
        const embedService = new EmbedService({ builder: new EmbedBuilder() })

        const updates = await this.dbClient.subscription.findMany({
            where: {
                active: true,
                next: {
                    gt: Date.now(),
                    lt: Date.now() + HOUR_INTERVAL,
                },
            },
        })

        logger.info(`Found ${updates.length} guilds scheduled to receive updates: ${updates.length ? updates.map((update: Subscription) => update.guild).join(', ') : 'N/A'}`)

        const object = await metCollectionService.getRandomCollectionObject()
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
                    await textChannel.send({ embeds: [embed] })

                    // update element in db
                    const next = Date.now() + DAY_INTERVAL

                    await this.dbClient.subscription.update({
                        data: {
                            lastSent: Date.now(),
                            next,
                        },
                        where: {
                            channel: update.channel,
                        },
                    })

                    // resolve
                    resolve(next)
                }
            })
        })

        await Promise.all(sendAndUpdatePromises)
    }
}
