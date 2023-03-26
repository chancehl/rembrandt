import dotenv from 'dotenv'
import { Events } from 'discord.js'

import { botClient } from './client'
import { handleInteraction, onClientReady } from './handlers'

// init .env vars
dotenv.config()

if (process.env.DISCORD_BOT_TOKEN) {
    // register global setup on ready
    botClient.once(Events.ClientReady, onClientReady)

    // register interactions
    botClient.on(Events.InteractionCreate, handleInteraction)

    // log in
    botClient.login(process.env.DISCORD_BOT_TOKEN)
} else {
    console.error('Missing DISCORD_BOT_TOKEN from .env file.')

    process.exit(1)
}
