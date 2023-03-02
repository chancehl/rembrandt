import { Client, CommandInteraction } from 'discord.js'

import { commands } from './commands'

export const handleSlashCommand = async (client: Client, interaction: CommandInteraction): Promise<void> => {
    const slashCommand = commands.find((c) => c.name === interaction.commandName)

    if (!slashCommand) {
        interaction.followUp({ content: 'An error has occurred' })
        return
    }

    await interaction.deferReply()

    slashCommand.run(client, interaction)
}
