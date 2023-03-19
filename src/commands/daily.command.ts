import { CommandInteraction, SlashCommandChannelOption, ApplicationCommandType } from 'discord.js'

import { Command } from './base.command'

// TODO: this is a stubbed out command for now
async function execute(interaction: CommandInteraction) {
    // parse query
    const channel = interaction.options.get('channel')

    console.log({ channel })

    // reply
    await interaction.reply('Testing')
}

// prettier-ignore
const channelOption = new SlashCommandChannelOption()
    .setName("channel")
    .setDescription("the channel to send your daily updates to")
    .setRequired(true)

export const DailyCommand: Command = {
    name: 'daily',
    description: 'use this command to configure daily updates',
    options: [channelOption],
    type: ApplicationCommandType.ChatInput,
    run: execute,
}
