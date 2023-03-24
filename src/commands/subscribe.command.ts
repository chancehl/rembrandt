import { CommandInteraction, SlashCommandChannelOption, ApplicationCommandType, TextChannel } from 'discord.js'

import { SubscriptionService } from '../services'
import { botClient } from '../client'
import { formatter as dateFormatter } from '../utils'

import { Command } from './base.command'

async function execute(interaction: CommandInteraction) {
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

    const subscriptionService = new SubscriptionService({ client: botClient })

    // TODO: register subscribe callback
    const next = await subscriptionService.subscribe(channel)

    const formattedDate = dateFormatter(next).format('LLL')

    // reply (validate user's subscription)
    await interaction.followUp({
        content: `Done! I'll send updates to **#${channel.name}** every 24 hours. You'll get your next one at **${formattedDate}**. Feel free to use the /art command in the meantime.`,
    })
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
