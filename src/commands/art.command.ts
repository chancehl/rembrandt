import { CommandInteraction, ApplicationCommandType, SlashCommandStringOption } from 'discord.js'

import { Command } from './base.command'

import { MetCollectionService, EmbedService, SummaryService } from '../services'
import { logger } from '../logger'

async function execute(interaction: CommandInteraction) {
    const metCollectionService = new MetCollectionService()
    const embedService = new EmbedService()
    const summaryService = new SummaryService()

    try {
        const query = interaction.options.get('query')

        logger.info(`User ${interaction.user.id} is executing the /art command with params: ${query == null ? 'none' : `query=${query.value}`}`)

        const object = await metCollectionService.getRandomCollectionObject(query?.value as string)

        logger.info(`Retrieved object ${object.objectID} from MET collection`)

        const summary = await summaryService.generateSummary(object)

        await interaction.followUp({
            ephemeral: true,
            embeds: [embedService.create(object)],
            content: summary,
        })
    } catch (err) {
        logger.error(`Encountered error while executing /art command: ${(err as unknown as Error).message}`)

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
