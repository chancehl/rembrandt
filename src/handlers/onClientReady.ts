import { Client } from 'discord.js'

/**
 * This gets invoked when the bot successfully joins a guild and emits the onReady event
 */
export async function onClientReady(bot: Client<true>) {
    // for now, just log. we'll collect metrics & init callbacks, slash commands here in the future
    console.log(`Ready! Logged in as ${bot.user.tag}`)
}
