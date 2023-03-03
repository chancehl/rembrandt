import { CommandInteraction, Client, ApplicationCommandType, Embed, EmbedBuilder } from 'discord.js'

import { Command } from './base.command'

const PHRASES = ['watchu think?', 'u like?', 'lol', 'UwU', 'OwO', 'oh yeah', 'omg', 'chefs kiss']

function pickRandomPhrase() {
    return PHRASES[Math.floor(Math.random() * PHRASES.length)]
}

async function execute(_client: Client, interaction: CommandInteraction) {
    // prettier-ignore
    const embed = new EmbedBuilder()
        .setImage('http://placekitten.com/200/300')
        .setTitle('Some kitten')
        .setDescription('Some kitty')

    await interaction.followUp({ ephemeral: true, content: pickRandomPhrase(), embeds: [embed] })
}

export const ArtCommand: Command = {
    name: 'art',
    description: 'i show u art',
    type: ApplicationCommandType.ChatInput,
    run: execute,
}
