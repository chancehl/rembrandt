import { CommandInteraction } from 'discord.js'

import { commands } from '../commands'

export async function handleSlashCommand(interaction: CommandInteraction): Promise<void> {
    const slashCommand = commands.find((c) => c.name === interaction.commandName)

    if (!slashCommand) {
        interaction.followUp({ content: 'An error has occurred' })
        return
    }

    await interaction.deferReply()

    slashCommand.run(interaction)
}
