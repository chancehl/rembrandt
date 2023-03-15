import { CommandInteraction, Client, ApplicationCommandType, SlashCommandStringOption } from 'discord.js'

import { Command } from './base.command'
import { pickRandomElement } from '../utils'
import { EmbedService, getAllCollectionObjectsWithImages, getCollectionObject, getCollectionObjectsByQuery, SearchObjectsResponse } from '../services'
import { RedisClientManager } from '../cache'

const redisClient = RedisClientManager.getInstance()

async function execute(_client: Client, interaction: CommandInteraction) {
    const query = interaction.options.get('query')

    let objectIds: number[] = []

    if (query != null && query.value) {
        const queryValue = query.value as string

        let objects: SearchObjectsResponse | null

        const cachedObjects = await redisClient.get(queryValue)

        if (cachedObjects) {
            objects = JSON.parse(cachedObjects) as SearchObjectsResponse
        } else {
            objects = await getCollectionObjectsByQuery(queryValue)

            // cache this query
            await redisClient.set(queryValue, JSON.stringify(objects))
        }

        objectIds = objects?.objectIDs ?? []
    } else {
        const objectsWithImages = await getAllCollectionObjectsWithImages()

        objectIds = objectsWithImages?.objectIDs ?? []
    }

    const object = await getCollectionObject(pickRandomElement(objectIds))

    if (object) {
        const embed = EmbedService.generateEmbedFromObject({ object })

        await interaction.followUp({
            ephemeral: true,
            content: 'i show u art',
            embeds: [embed],
        })
    }
}

// prettier-ignore
const queryOption = new SlashCommandStringOption()
    .setName('query')
    .setDescription('something to search for')
    .setMinLength(3)
    .setMaxLength(50);

export const ArtCommand: Command = {
    name: 'art',
    description: 'i show u art',
    options: [queryOption],
    type: ApplicationCommandType.ChatInput,
    run: execute,
}
