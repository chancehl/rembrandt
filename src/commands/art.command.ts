import { CommandInteraction, Client, ApplicationCommandType, Embed, EmbedBuilder } from 'discord.js'

import { Command } from './base.command'
import { getAllObjectsWithImages } from '../services'

async function execute(_client: Client, interaction: CommandInteraction) {
    const objectsWithImages = await getAllObjectsWithImages()

    console.log({ objectsWithImages })

    // prettier-ignore
    const embed = new EmbedBuilder()
        .setImage('http://placekitten.com/200/300')
        .setTitle('Some kitten')
        .setDescription('Some kitty')

    await interaction.followUp({ ephemeral: true, content: 'i show u art', embeds: [embed] })
}

export const ArtCommand: Command = {
    name: 'art',
    description: 'i show u art',
    type: ApplicationCommandType.ChatInput,
    run: execute,
}
