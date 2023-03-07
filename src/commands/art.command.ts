import { CommandInteraction, Client, ApplicationCommandType, EmbedBuilder, SlashCommandStringOption } from 'discord.js'

import { Command } from './base.command'
import { getAllObjectsWithImages, getObjectsByQuery } from '../services'

async function execute(_client: Client, interaction: CommandInteraction) {
    const query = interaction.options.get('query')

    if (query != null && query.value) {
        const objects = await getObjectsByQuery(query.value as string, { includesImages: true })

        console.log('matching objects', { objects })
    } else {
        const objectsWithImages = await getAllObjectsWithImages()

        console.log('all objects with images', { objectsWithImages })
    }

    // prettier-ignore
    const embed = new EmbedBuilder()
        .setImage('https://upload.wikimedia.org/wikipedia/en/0/02/Homer_Simpson_2006.png')
        .setTitle('Some kitten')
        .setDescription('Some kitty')

    console.log({ embed })

    await interaction.followUp({ ephemeral: true, content: 'i show u art', embeds: [embed] })
}

// prettier-ignore
const queryOption = new SlashCommandStringOption()
    .setName('query')
    .setDescription('something to search for')
    .setMinLength(2)
    .setMaxLength(50);

export const ArtCommand: Command = {
    name: 'art',
    description: 'i show u art',
    options: [queryOption],
    type: ApplicationCommandType.ChatInput,
    run: execute,
}
