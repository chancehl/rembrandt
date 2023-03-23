import { Client as BotClient, EmbedBuilder, TextChannel } from 'discord.js'

import { EmbedService } from '../embedService'
import { MetCollectionService } from '../metCollectionService'

type ConstructorParams = {
    client: BotClient
    metCollectionService?: MetCollectionService
    embedService?: EmbedService
}

export const INTERVAL = 1000 * 60 * 60 * 24

export class DailyUpdateService {
    private client: BotClient
    private metCollectionService: MetCollectionService
    private embedService: EmbedService

    constructor({ client, embedService, metCollectionService }: ConstructorParams) {
        this.client = client
        this.embedService = embedService ?? new EmbedService({ builder: new EmbedBuilder() })
        this.metCollectionService = metCollectionService ?? new MetCollectionService()
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

    async subscribe(channelId: string) {
        this.registerSendCallback(channelId)

        return new Date(Date.now() + INTERVAL).toISOString()
    }

    private async registerSendCallback(channelId: string) {
        setInterval(() => {
            this.send(channelId)
        }, INTERVAL)
    }
}
