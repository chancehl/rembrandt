import dotenv from 'dotenv'
import { Client, Events, GatewayIntentBits, Interaction } from 'discord.js'

import { commands } from './commands'
import { handleSlashCommand } from './interaction'

// init .env vars
dotenv.config()

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once(Events.ClientReady, (bot) => {
    // set bot commands
    bot.application.commands.set(commands)

    console.log(`Ready! Logged in as ${bot.user.tag}`)
})

// register interactions
client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isCommand()) {
        await handleSlashCommand(client, interaction)
    }
})

// Log in to Discord with your client's token
client.login(process.env.DISCORD_BOT_TOKEN)
