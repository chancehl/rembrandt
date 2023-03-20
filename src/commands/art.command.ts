import { CommandInteraction, Client, ApplicationCommandType, SlashCommandStringOption, CommandInteractionOption, CacheType } from 'discord.js'

import { Command } from './base.command'

import { getRandomCollectionObject, generateEmbedFromObject } from '../services'

async function execute(interaction: CommandInteraction) {
    try {
        const query = interaction.options.get('query')

        const object = await getRandomCollectionObject(query?.value as string)

        const embed = generateEmbedFromObject({ object })

        await interaction.followUp({
            ephemeral: true,
            content: 'i show u art',
            embeds: [embed],
        })
    } catch (err) {
        await interaction.followUp({ ephemeral: true, content: 'Something went wrong. Sorry!' })
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
