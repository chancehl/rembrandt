import { CommandInteraction, Client, ApplicationCommandType, EmbedBuilder, SlashCommandStringOption } from 'discord.js'

import { Command } from './base.command'
import { pickRandomElement } from '../utils'
import { getAllObjectsWithImages, getObject, getObjectsByQuery } from '../services'

const DEFAULT_IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/en/0/02/Homer_Simpson_2006.png'

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

    const objectId = pickRandomElement(objectIds)

    const object = await getObject(objectId)

    console.log({ object })

    // prettier-ignore
    const embed = new EmbedBuilder()
        .setImage(object?.primaryImage ?? DEFAULT_IMAGE_URL)
        .setTitle('Some kitten')
        .setDescription('Some kitty')

    console.log({ embed })

    await interaction.followUp({ ephemeral: true, content: 'i show u art', embeds: [embed] })
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
