import dotenv from 'dotenv'
import { Client as BotClient, Events, GatewayIntentBits } from 'discord.js'

import { handleInteraction, registerCommands, onClientReady } from './handlers'

// init .env vars
dotenv.config()

if (process.env.DISCORD_BOT_TOKEN) {
    // create a new client instance
    const bot = new BotClient({ intents: [GatewayIntentBits.Guilds] })

    // register global setup on ready
    bot.once(Events.ClientReady, registerCommands) // TODO: move this to onClientReady
    bot.once(Events.ClientReady, onClientReady)

    // register interactions
    bot.on('interactionCreate', handleInteraction)

    // log in
    bot.login(process.env.DISCORD_BOT_TOKEN)
} else {
    console.error('Missing DISCORD_BOT_TOKEN from .env file.')

    process.exit(1)
}
