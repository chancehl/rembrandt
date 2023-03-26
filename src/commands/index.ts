import { Command } from './base.command'

import { ArtCommand } from './art.command'
import { SubscribeCommand } from './subscribe.command'
import { UnsubscribeCommand } from './unsubscribe.command'

export const commands: Command[] = [ArtCommand, SubscribeCommand, UnsubscribeCommand]
