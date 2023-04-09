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

        const embed = embedService.create({ object })

        await interaction.followUp({
            ephemeral: true,
            embeds: [embed],
            content: summary,
        })
    } catch (err) {
        logger.error(`Encountered error while executing /art command: ${(err as unknown as Error).message}`)

        await interaction.followUp({ ephemeral: true, content: 'Something went wrong. Sorry!' })
    }
}

// TODO: re-enable once we've fixed fuzzy search
// prettier-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const queryOption = new SlashCommandStringOption()
    .setName('query')
    .setDescription('something to search for')
    .setMinLength(3)
    .setMaxLength(50);

export const ArtCommand: Command = {
    name: 'art',
    description: 'i show u art',
    // options: [queryOption],
    type: ApplicationCommandType.ChatInput,
    run: execute,
}
