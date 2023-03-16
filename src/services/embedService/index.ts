import { EmbedBuilder } from 'discord.js'

import { CollectionObject } from '../../types'

type GenerateEmbedFromObjectsParams = {
    object: Partial<CollectionObject>
    builder?: EmbedBuilder
}

/** Generates a series of key-value pair objects based on the fields present in the response */
export function generateEmbedFromObject({ object, builder }: GenerateEmbedFromObjectsParams) {
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

    // note: this is purposefully duplicated here so that the download link goes at the bottom
    if (object.primaryImage) {
        embed.addFields({ name: 'Download link', value: object.primaryImage })
    }

    return embed
}
