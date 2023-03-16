import dotenv from 'dotenv'
import { Client as BotClient, Events, GatewayIntentBits } from 'discord.js'

import { handleInteraction, handleClientReadyEvent } from './handlers'

// init .env vars
dotenv.config()

// create a new client instance
const bot = new BotClient({ intents: [GatewayIntentBits.Guilds] })

// register global setup on ready
bot.once(Events.ClientReady, handleClientReadyEvent)

// register interactions
bot.on('interactionCreate', handleInteraction)

// log in
bot.login(process.env.DISCORD_BOT_TOKEN)
