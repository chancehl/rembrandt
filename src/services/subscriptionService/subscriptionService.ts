import { PrismaClient } from '@prisma/client'
import { Client as BotClient, TextChannel } from 'discord.js'

import { DAY_INTERVAL, HOUR_INTERVAL } from '../../constants'
import { EmbedService } from '../embedService'
import { MetCollectionService } from '../metCollectionService'

import { SubscriptionDoesNotExistError } from './error'

type ConstructorParams = {
    client: BotClient
    metCollectionService?: MetCollectionService
    embedService?: EmbedService
    dbClient?: PrismaClient
}

export const INTERVAL = 1000 * 60 * 60 * 24

export class SubscriptionService {
    private dbClient: PrismaClient

    constructor({ dbClient }: ConstructorParams) {
        this.dbClient = dbClient ?? new PrismaClient()
    }

    async subscribe(channel: TextChannel) {
        const next = Date.now() + HOUR_INTERVAL // temporarily set this to 1hr for testing

        await this.dbClient.subscription.upsert({
            create: {
                next,
                active: true,
                createdOn: new Date().toISOString(),
                guild: channel.guild.id,
                channel: channel.id,
            },
            where: { guild: channel.guild.id },
            update: { active: true, next },
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
                data: { active: false, next: undefined },
                where: { guild: guildId },
            })

            return existing
        } else {
            throw new SubscriptionDoesNotExistError(guildId)
        }
    }
}
