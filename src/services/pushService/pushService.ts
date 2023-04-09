import { PrismaClient, Subscription } from '@prisma/client'
import { TextChannel } from 'discord.js'
import cron from 'node-cron'

import { botClient } from '../../clients'
import { logger } from '../../logger'
import { InjectableServices } from '../services'
import { EmbedService } from '../embedService'
import { MetCollectionService } from '../metCollectionService'
import { SummaryService } from '../summaryService'
import { ONE_DAY, ONE_HOUR } from '../../constants'

export const PUSH_SERVICE_CRON_JOB = '0 * * * *'

export class PushService {
    private dbClient: PrismaClient
    private metCollectionService: MetCollectionService
    private embedService: EmbedService
    private summaryService: SummaryService

    constructor(args?: Partial<Omit<InjectableServices, 'PushService'>>) {
        this.dbClient = args?.dbClient ?? new PrismaClient()
        this.metCollectionService = args?.metCollectionService ?? new MetCollectionService()
        this.embedService = args?.embedService ?? new EmbedService()
        this.summaryService = args?.summaryService ?? new SummaryService()
    }

    async scheduleUpdates() {
        cron.schedule(PUSH_SERVICE_CRON_JOB, async () => {
            await this.sendUpdates()
        })
    }

    async sendUpdates() {
        const now = Date.now()

        const updates = await this.dbClient.subscription.findMany({
            where: {
                active: true,
                OR: {
                    next: {
                        lt: now + ONE_HOUR,
                    },
                    lastSent: {
                        lt: now - ONE_DAY,
                    },
                },
            },
        })

        logger.info(`Found ${updates.length} guilds scheduled to receive updates: ${updates.length ? updates.map((update: Subscription) => update.guild).join(', ') : 'N/A'}`)

        if (updates.length > 0) {
            const object = await this.metCollectionService.getRandomCollectionObject()
            const summary = await this.summaryService.generateSummary(object)
            const embed = this.embedService.create({ object })

            const sendAndUpdatePromises = updates.map((update: Subscription) => {
                // eslint-disable-next-line no-async-promise-executor
                return new Promise(async (resolve, reject) => {
                    logger.info(`Sending daily update to guild ${update.guild} (channel = ${update.channel})`)

                    const channel = await botClient.channels.fetch(update.channel)

                    if (channel == null) {
                        reject('Missing channel')
                    }

                    const textChannel = channel as TextChannel

                    // send update
                    await textChannel.send({ embeds: [embed], content: summary })

                    // update element in db
                    await this.dbClient.subscription.update({
                        data: {
                            lastSent: now,
                            next: now + ONE_DAY,
                        },
                        where: {
                            channel: update.channel,
                        },
                    })

                    // resolve
                    resolve(update.next)
                })
            })

            await Promise.all(sendAndUpdatePromises)
        }
    }
}
