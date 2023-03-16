import dotenv from 'dotenv'
import { Client, Events, GatewayIntentBits, Interaction } from 'discord.js'

import { commands } from './commands'
import { handleSlashCommand } from './interaction'
import { RedisClientManager } from './cache'

// init .env vars
dotenv.config()

// create a redis instance
const redisClient = RedisClientManager.getInstance()

// Create a new client instance
const botClient = new Client({ intents: [GatewayIntentBits.Guilds] })

botClient.once(Events.ClientReady, async (bot) => {
    // set bot commands
    bot.application.commands.set(commands)

    try {
        // connect to redis instance
        await redisClient.connect()
    } catch (redisConnectionError) {
        console.error(`Encountered the following error while connecting to redis client:\n`, redisConnectionError)

        process.exit(1)
    }

    console.log(`Ready! Logged in as ${bot.user.tag}`)
})

// register interactions
botClient.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isCommand()) {
        await handleSlashCommand(botClient, interaction)
    }
})

// Log in to Discord with your client's token
botClient.login(process.env.DISCORD_BOT_TOKEN)
