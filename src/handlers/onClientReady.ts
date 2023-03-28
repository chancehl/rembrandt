import { Client } from 'discord.js'
import dayjs from 'dayjs'
import plugin from 'dayjs/plugin/localizedFormat'

import { commands } from '../commands'
import { DbManager } from '../db'
import { PushService } from '../services'
import { logger } from '../logger'

/**
 * This gets invoked when the bot successfully joins a guild and emits the onReady event
 */
export async function onClientReady(bot: Client<true>) {
    // extend dayjs so that we can use localized formatting in logs
    dayjs.extend(plugin)

    // register commands
    bot.application.commands.set(commands)

    // connect to db
    await DbManager.connect()

    // note: this just schedules the push notifications, this doesn't actually send them
    // see `PushService.sendUpdate()` for impl
    const pushService = new PushService()

    await pushService.scheduleUpdates()

    // for now, just log. we'll collect metrics & init callbacks, slash commands here in the future
    logger.info(`onClientReady: logged in as ${bot.user.tag}`)
}
