import { EmbedBuilder } from 'discord.js'

import { CollectionObject } from '../../types'

type ConstructorArgs = {
    builder: EmbedBuilder
}

export class EmbedService {
    builder: EmbedBuilder

    constructor(args?: ConstructorArgs) {
        this.builder = args?.builder ?? new EmbedBuilder()
    }

    /** Generates a series of key-value pair objects based on the fields present in the response */
    create(object: Partial<CollectionObject>) {
        const embed = this.builder

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
}
