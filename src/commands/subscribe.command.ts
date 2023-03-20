import { CommandInteraction, SlashCommandChannelOption, ApplicationCommandType, TextChannel } from 'discord.js'

import { DailyUpdateService } from '../services'

import { Command } from './base.command'

async function execute(interaction: CommandInteraction) {
    const dailyUpdateService = new DailyUpdateService()

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

    // TODO: register subscribe callback
    await dailyUpdateService.subscribe()

    // reply
    await interaction.followUp({ content: 'Testing' })
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
