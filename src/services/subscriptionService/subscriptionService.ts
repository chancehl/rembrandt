import { PrismaClient } from '@prisma/client'
import { TextChannel } from 'discord.js'
import dayjs from 'dayjs'

import { SubscriptionDoesNotExistError } from './error'
import { InjectableServices } from '../services'

export class SubscriptionService {
    private dbClient: PrismaClient

    constructor(args?: Partial<Omit<InjectableServices, 'SubscriptionService'>>) {
        this.dbClient = args?.dbClient ?? new PrismaClient()
    }

    async subscribe(channel: TextChannel) {
        const now = dayjs()

        const next = now.add(1, 'hour').unix()

        await this.dbClient.subscription.upsert({
            create: {
                next,
                active: true,
                createdOn: new Date().toISOString(),
                guild: channel.guild.id,
                channel: channel.id,
            },
            where: {
                guild: channel.guild.id,
            },
            update: {
                active: true,
                next,
            },
        })

        return next
    }

    async unsubscribe(guildId: string) {
        const existing = await this.dbClient.subscription.findFirst({
            where: {
                guild: guildId,
                active: true,
            },
        })

        if (existing) {
            // soft delete
            await this.dbClient.subscription.update({
                data: {
                    active: false,
                    next: undefined,
                },
                where: {
                    guild: guildId,
                },
            })

            return existing
        } else {
            throw new SubscriptionDoesNotExistError(guildId)
        }
    }
}
