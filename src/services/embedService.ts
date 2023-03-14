import { EmbedBuilder } from 'discord.js'

import { CollectionObject } from './metApiService.types'

export class EmbedService {
    /** Generates a series of key-value pair objects based on the fields present in the response */
    static generateEmbedFromObject(object: Partial<CollectionObject>) {
        const embed = new EmbedBuilder()

        if (object.primaryImage) {
            embed.setImage(object.primaryImage)
        }

        if (object.title) {
            embed.setTitle(object.title)
        }

        if (object.artistDisplayName) {
            embed.setDescription(`by ${object.artistDisplayName}`)
        }

        if (object.objectDate) {
            embed.addFields({ name: 'Date', value: object.objectDate })
        }

        if (object.department) {
            embed.addFields({ name: 'Department', value: object.department })
        }

        if (object.dimensions) {
            embed.addFields({ name: 'Dimensions', value: object.dimensions })
        }

        return embed
    }
}
