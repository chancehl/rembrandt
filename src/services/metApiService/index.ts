import axios from 'axios'

import { GetCollectionObjectResponse, SearchCollectionObjectsResponse } from '../../types'
import { pickRandomElement } from '../../utils'

const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1'

export async function getAllCollectionObjectsWithImages(): Promise<SearchCollectionObjectsResponse> {
    const response = await axios.get<SearchCollectionObjectsResponse>(BASE_URL.concat('/search?q=.&hasImages=true'))

    return response.data
}

export async function getCollectionObjectsByQuery(q: string): Promise<SearchCollectionObjectsResponse> {
    const response = await axios.get<SearchCollectionObjectsResponse>(BASE_URL.concat(`/search?q=${encodeURIComponent(q)}&hasImages=true`))

    return response.data
}

export async function getCollectionObject(id: number): Promise<GetCollectionObjectResponse> {
    const response = await axios.get<GetCollectionObjectResponse>(BASE_URL.concat(`/objects/${id}`))

    return response.data
}

export async function getRandomCollectionObject(query?: string): Promise<GetCollectionObjectResponse> {
    // get all collection object ids
    // prettier-ignore
    const objects = query == null 
        ? await getAllCollectionObjectsWithImages() 
        : await getCollectionObjectsByQuery(query)

    // pick a random element
    const objectId = pickRandomElement(objects.objectIDs ?? [])

    // get a specific object
    const object = await getCollectionObject(objectId)

    return object
}
