import { PrismaClient } from '@prisma/client'
import { EmbedBuilder, TextChannel } from 'discord.js'
import cron from 'node-cron'

import { botClient } from '../../clients'
import { HOUR_INTERVAL } from '../../constants'
import { EmbedService } from '../embedService'
import { MetCollectionService } from '../metCollectionService'

export const PUSH_SERVICE_CRON_JOB = '0 * * * *'

export class PushService {
    private dbClient: PrismaClient

    constructor() {
        this.dbClient = new PrismaClient()
    }

    async scheduleUpdates() {
        cron.schedule(PUSH_SERVICE_CRON_JOB, async () => {
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

        const object = await metCollectionService.getRandomCollectionObject()
        const embed = embedService.create(object)

        const sendAndUpdatePromises = updates.map((update) => {
            return new Promise(async (resolve, reject) => {
                const channel = await botClient.channels.fetch(update.channel)

                if (channel == null) {
                    reject('Missing channel')
                } else {
                    const textChannel = channel as TextChannel

                    // send update
                    await textChannel.send({ embeds: [embed] })

                    // update element in db
                    const next = Date.now() + PUSH_INTERVAL

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
