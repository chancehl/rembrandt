import { CommandInteraction, Client, ApplicationCommandType, SlashCommandStringOption, CommandInteractionOption, CacheType } from 'discord.js'

import { Command } from './base.command'

import { pickRandomElement } from '../utils'
import { RedisClientManager } from '../cache'
import { SearchCollectionObjectsResponse } from '../types'
import { getAllCollectionObjectsWithImages, getCollectionObject, getCollectionObjectsByQuery, generateEmbedFromObject } from '../services'

const redisClient = RedisClientManager.getInstance()

async function getCollectionObjectIds(query: CommandInteractionOption<CacheType> | null) {
    let objectIds: number[] = []

    if (query != null && query.value) {
        const queryValue = query.value as string

        let objects: SearchCollectionObjectsResponse | null

        const cachedObjects = await redisClient.get(queryValue)

        if (cachedObjects) {
            objects = JSON.parse(cachedObjects) as SearchCollectionObjectsResponse
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

    return objectIds
}

async function execute(interaction: CommandInteraction) {
    try {
        // parse query
        const query = interaction.options.get('query')

        // get all collection object ids
        const objectIds = await getCollectionObjectIds(query)

        // pick a random element
        const objectId = pickRandomElement(objectIds)

        // get a specific object
        const object = await getCollectionObject(objectId)

        // generate an embed with all the appropriate object data
        const embed = generateEmbedFromObject({ object })

        // reply
        await interaction.followUp({
            ephemeral: true,
            content: 'i show u art',
            embeds: [embed],
        })
    } catch (err) {
        console.error(err, { getAllCollectionObjectsWithImages, getCollectionObject })

        await interaction.followUp({ ephemeral: true, content: 'Something went wrong. Sorry!' })
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
