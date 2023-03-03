import { CommandInteraction, Client, ApplicationCommandType, Embed, EmbedBuilder } from 'discord.js'

import { Command } from './base.command'
import { pickRandomElement, pickRandomInt } from '../utils'
import { getObjectIds } from '../services'

const PHRASES = ['watchu think?', 'u like?', 'lol', 'UwU', 'OwO', 'oh yeah', 'omg', 'chefs kiss']

async function execute(_client: Client, interaction: CommandInteraction) {
    // this is slow as hell, for now just pick a number between 1 - max for now, it'll probably work
    // const objectIDs = await getObjectIds()

    const objectId = pickRandomInt(1, 485_000)

    console.log({ objectId })

    // prettier-ignore
    const embed = new EmbedBuilder()
        .setImage('http://placekitten.com/200/300')
        .setTitle('Some kitten')
        .setDescription('Some kitty')

    await interaction.followUp({ ephemeral: true, content: pickRandomElement(PHRASES), embeds: [embed] })
}

export const ArtCommand: Command = {
    name: 'art',
    description: 'i show u art',
    type: ApplicationCommandType.ChatInput,
    run: execute,
}
