import { CommandInteraction, SlashCommandChannelOption, ApplicationCommandType, TextChannel } from 'discord.js'

import { SubscriptionService } from '../services'
import { botClient } from '../clients'
import { formatter as dateFormatter } from '../utils'
import { logger } from '../logger'

import { Command } from './base.command'

async function execute(interaction: CommandInteraction) {
    logger.info(`User ${interaction.user.id} is registering discord server ${interaction.guildId} for daily updates`)

    const channelOption = interaction.options.get('channel')

    if (channelOption == null) {
        await interaction.followUp({ content: 'I need to know which channel you want me to send updates to.' })

        return
    }

    const channel = channelOption.channel

    if (!(channel instanceof TextChannel)) {
        await interaction.followUp({ content: 'Sorry, I only support sending daily updates to **text channels** at the moment.' })

        return
    }

    try {
        const subscriptionService = new SubscriptionService({ client: botClient })

        const next = await subscriptionService.subscribe(channel)

        const formattedDate = dateFormatter(next).format('LLL')

        // reply (validate user's subscription)
        await interaction.followUp({
            content: `Done! I'll send updates to **#${channel.name}** every 24 hours. You'll get your next one at **${formattedDate}**. Feel free to use the /art command in the meantime.`,
        })
    } catch (err) {
        logger.error(`Encountered the following error while subscribing to daily updates: ${(err as unknown as Error).message}`)

        await interaction.followUp(`Sorry, something went wrong.`)
    }
}

// prettier-ignore
const channelOption = new SlashCommandChannelOption()
    .setName("channel")
    .setDescription("the text channel to send your daily updates to")
    .setRequired(true)

export const SubscribeCommand: Command = {
    name: 'subscribe',
    description: 'use this command to subscribe to daily updates',
    options: [channelOption],
    type: ApplicationCommandType.ChatInput,
    run: execute,
}
