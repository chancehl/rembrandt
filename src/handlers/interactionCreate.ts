import { Interaction } from 'discord.js'

import { handleSlashCommand } from './interaction'

export async function handleInteraction(interaction: Interaction) {
    if (interaction.isCommand()) {
        await handleSlashCommand(interaction)
    }
}
