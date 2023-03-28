import { CommandInteraction, SlashCommandChannelOption, ApplicationCommandType, TextChannel, GuildMember } from 'discord.js'
import dayjs from 'dayjs'

import { SubscriptionService } from '../services'
import { botClient } from '../clients'
import { logger } from '../logger'

import { Command } from './base.command'

async function execute(interaction: CommandInteraction) {
    logger.info(`User ${interaction.user.id} is registering discord server ${interaction.guildId} for daily updates`)

    if (!interaction.guild) {
        logger.warn(`User ${interaction.user.id} tried to subscribe via DM.`)

        await interaction.followUp(`Sorry, I only support sending daily updates to servers (not in DMs) at the moment.`)

        return
    }

    const isAdmin = (interaction.member as GuildMember).permissions.has('Administrator')

    if (!isAdmin) {
        logger.warn(`User ${interaction.user.id} tried to subscribe server ${interaction.guild.id} up for daily updates, but they are not an admin`)

        await interaction.followUp(`Sorry, only server Administrators can run this command.`)

        return
    }

    const channelOption = interaction.options.get('channel')

    if (channelOption == null) {
        await interaction.followUp({ content: 'I need to know which channel you want me to send updates to.' })

        return
    }

    const channel = channelOption.channel

    if (!(channel instanceof TextChannel)) {
        logger.warn(`User ${interaction.user.id} tried to subscribe in a voice channel.`)

        await interaction.followUp({ content: 'Sorry, I only support sending daily updates to **text channels** at the moment.' })

        return
    }

    try {
        const subscriptionService = new SubscriptionService({ client: botClient })

        const next = await subscriptionService.subscribe(channel)

        const formattedDate = dayjs(next * 1000).format('LLL')

        logger.info(`User ${interaction.user.id} successfully subscribed to daily updates, next=${next} (${formattedDate})`)

        // reply (validate user's subscription)
        await interaction.followUp({
            content: `Done! I'll send updates to **#${channel.name}** every 24 hours. You'll get your next one at **${formattedDate}**. Feel free to use the /art command in the meantime.`,
        })
    } catch (err) {
        logger.error(`Encountered the following error while subscribing to daily updates: ${(err as unknown as Error).message}`)

        await interaction.followUp(`Sorry, something went wrong.`)
    }
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
