import { CommandInteraction, SlashCommandChannelOption, ApplicationCommandType, ChannelType } from 'discord.js'

import { Command } from './base.command'

async function execute(interaction: CommandInteraction) {
    const channel = interaction.options.get('channel')

    if (channel == null) {
        await interaction.followUp({ content: 'I need to know which channel you want me to send updates to.' })

        return
    }

    // channel.type is 0-15, these DO have overlap.
    // TODO: remove the cast to unknown once this can be parsed into a ChannelType
    const channelType = channel.type as unknown as ChannelType

    if (channelType != ChannelType.GuildText) {
        await interaction.followUp({ content: 'Sorry, I only support sending daily updates to **text channels** at the moment.' })

        return
    }

    // TODO: register subscribe callback

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
