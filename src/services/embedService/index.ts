import { EmbedBuilder } from 'discord.js'

import type { CollectionObject } from '../metApiService'

type GenerateEmbedFromObjectsParams = {
    object: Partial<CollectionObject>
    builder?: EmbedBuilder
}

export class EmbedService {
    /** Generates a series of key-value pair objects based on the fields present in the response */
    static generateEmbedFromObject({ object, builder }: GenerateEmbedFromObjectsParams) {
        const embed = builder ?? new EmbedBuilder()

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
