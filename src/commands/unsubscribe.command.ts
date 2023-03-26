import { CommandInteraction, ApplicationCommandType } from 'discord.js'

import { SubscriptionDoesNotExistError, SubscriptionService } from '../services'
import { botClient } from '../client'

import { Command } from './base.command'

async function execute(interaction: CommandInteraction) {
    const subscriptionService = new SubscriptionService({ client: botClient })

    try {
        if (interaction.guildId) {
            await subscriptionService.unsubscribe(interaction.guildId)

            await interaction.followUp(`Your discord successfully unsubscribed from daily updates.`)
        } else {
            await interaction.followUp(`Sorry, this command is only supported within a discord server.`)
        }
    } catch (error) {
        if (error instanceof SubscriptionDoesNotExistError) {
            await interaction.followUp('Your discord does not have an existing subscription. Did you want to create one instead with the `/subscribe` command?')
        }
    }
}

export const UnsubscribeCommand: Command = {
    name: 'unsubscribe',
    description: 'use this command to unsubscribe from daily updates',
    type: ApplicationCommandType.ChatInput,
    run: execute,
}
