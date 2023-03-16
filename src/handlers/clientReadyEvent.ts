import { Client } from 'discord.js'

import { RedisClientManager } from '../cache'
import { commands } from '../commands'

// Note: this only gets invoked on client ready event (where the type of Client<boolean> will always already be true)
type ReadyClient = Client<true>

export async function handleClientReadyEvent(bot: ReadyClient) {
    // create a redis instance
    const redisClient = RedisClientManager.getInstance()

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
}
