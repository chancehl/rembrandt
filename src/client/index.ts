import { GatewayIntentBits, Client as BotClient } from 'discord.js'

// create a new client instance
export const botClient = new BotClient({ intents: [GatewayIntentBits.Guilds] })
