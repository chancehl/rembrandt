import { PrismaClient } from '@prisma/client'
import { Client as BotClient, EmbedBuilder, TextChannel } from 'discord.js'

import { EmbedService } from '../embedService'
import { MetCollectionService } from '../metCollectionService'

type ConstructorParams = {
    client: BotClient
    metCollectionService?: MetCollectionService
    embedService?: EmbedService
    dbClient?: PrismaClient
}

export const INTERVAL = 1000 * 60 * 60 * 24

export class SubscriptionService {
    private client: BotClient
    private metCollectionService: MetCollectionService
    private embedService: EmbedService
    private dbClient: PrismaClient

    constructor({ client, embedService, metCollectionService, dbClient }: ConstructorParams) {
        this.client = client
        this.embedService = embedService ?? new EmbedService({ builder: new EmbedBuilder() })
        this.metCollectionService = metCollectionService ?? new MetCollectionService()
        this.dbClient = dbClient ?? new PrismaClient()
    }

    async send(channelId: string) {
        const channel = this.client.channels.cache.get(channelId) as TextChannel | undefined

        if (channel) {
            const object = await this.metCollectionService.getRandomCollectionObject()
            const embed = this.embedService.create(object)

            channel.send({ embeds: [embed] })
        } else {
            // TODO: handle scenario where the channel id does not exist
        }
    }

    async subscribe(channel: TextChannel) {
        // register callbacks
        this.registerSendCallback(channel.id)

        const next = new Date(Date.now() + INTERVAL).toISOString()

        // save in db
        await this.dbClient.susbcription.upsert({
            create: {
                next,
                active: true,
                createdOn: new Date().toISOString(),
                guild: channel.guild.id,
            },
            where: { guild: channel.guild.id },
            update: { active: true },
        })

        return next
    }

    private async registerSendCallback(channelId: string) {
        setInterval(() => {
            this.send(channelId)
        }, INTERVAL)
    }
}
