import { CommandInteraction, SlashCommandChannelOption, ApplicationCommandType, TextChannel } from 'discord.js'
import dayjs from 'dayjs'
import plugin from 'dayjs/plugin/localizedFormat'

import { DailyUpdateService } from '../services'
import { botClient } from '../client'

import { Command } from './base.command'

dayjs.extend(plugin) // TODO: find a better place for this

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

    const dailyUpdateService = new DailyUpdateService({ client: botClient })

    // TODO: register subscribe callback
    const next = await dailyUpdateService.subscribe(channel.id)
    const formattedDate = dayjs(next).format('LLL')

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
