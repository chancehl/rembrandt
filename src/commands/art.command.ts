import { CommandInteraction, ApplicationCommandType, SlashCommandStringOption, EmbedBuilder } from 'discord.js'

import { Command } from './base.command'

import { MetCollectionService, EmbedService, SummaryService } from '../services'

async function execute(interaction: CommandInteraction) {
    const metCollectionService = new MetCollectionService()
    const embedService = new EmbedService({ builder: new EmbedBuilder() })
    const summaryService = new SummaryService()

    try {
        const query = interaction.options.get('query')

        const object = await metCollectionService.getRandomCollectionObject(query?.value as string)

        const summary = await summaryService.generateSummary(object)

        await interaction.followUp({
            ephemeral: true,
            embeds: [embedService.create(object)],
            content: summary,
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
