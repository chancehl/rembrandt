import { ArtCommand } from './art.command'
import { SubscribeCommand } from './subscribe.command'
import { Command } from './base.command'

export const commands: Command[] = [ArtCommand, SubscribeCommand]
