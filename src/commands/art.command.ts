import { CommandInteraction, Client, ApplicationCommandType, EmbedBuilder, SlashCommandStringOption, APIEmbedField } from 'discord.js'

import { Command } from './base.command'
import { pickRandomElement } from '../utils'
import { EmbedService, getAllObjectsWithImages, getObject, getObjectsByQuery } from '../services'

async function execute(_client: Client, interaction: CommandInteraction) {
    const query = interaction.options.get('query')

    let objectIds: number[] = []

    if (query != null && query.value) {
        const objects = await getObjectsByQuery(query.value as string)

        objectIds = objects?.objectIDs ?? []
    } else {
        const objectsWithImages = await getAllObjectsWithImages()

        objectIds = objectsWithImages?.objectIDs ?? []
    }

    const object = await getObject(pickRandomElement(objectIds))

    if (object) {
        await interaction.followUp({
            ephemeral: true,
            content: 'i show u art',
            embeds: [EmbedService.generateEmbedFromObject(object)],
        })
    }
}

// prettier-ignore
const queryOption = new SlashCommandStringOption()
    .setName('query')
    .setDescription('something to search for')
    .setMinLength(3)
    .setMaxLength(50);

export const ArtCommand: Command = {
    name: 'art',
    description: 'i show u art',
    options: [queryOption],
    type: ApplicationCommandType.ChatInput,
    run: execute,
}
