import { Client } from 'discord.js'

import { commands } from '../commands'
import { DbManager } from '../db'

/**
 * This gets invoked when the bot successfully joins a guild and emits the onReady event
 */
export async function onClientReady(bot: Client<true>) {
    // register commands
    bot.application.commands.set(commands)

    // connect to db
    await DbManager.connect()

    // for now, just log. we'll collect metrics & init callbacks, slash commands here in the future
    console.log(`Ready! Logged in as ${bot.user.tag}`)
}
