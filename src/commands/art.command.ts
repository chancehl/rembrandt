import { CommandInteraction, Client, ApplicationCommandType } from 'discord.js'

import { Command } from './base.command'

async function execute(_client: Client, interaction: CommandInteraction) {
    await interaction.followUp({ ephemeral: true, content: 'pong' })
}

export const ArtCommand: Command = {
    name: 'art',
    description: 'i show u art',
    type: ApplicationCommandType.ChatInput,
    run: execute,
}
