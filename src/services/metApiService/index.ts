import axios from 'axios'

import { GetCollectionObjectResponse, SearchCollectionObjectsResponse } from './index.types'

const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1'

export async function getAllCollectionObjectsWithImages(): Promise<SearchCollectionObjectsResponse | null> {
    try {
        const { data } = await axios.get<SearchCollectionObjectsResponse>(BASE_URL.concat('/search?q=.&hasImages=true'))

        return data
    } catch (ex) {
        return null
    }
}

export async function getCollectionObjectsByQuery(q: string): Promise<SearchCollectionObjectsResponse | null> {
    try {
        const { data } = await axios.get<SearchCollectionObjectsResponse>(BASE_URL.concat(`/search?q=${encodeURIComponent(q)}&hasImages=true`))

        return data
    } catch (ex) {
        return null
    }
}

export async function getCollectionObject(id: number): Promise<GetCollectionObjectResponse | null> {
    try {
        const { data } = await axios.get<GetCollectionObjectResponse>(BASE_URL.concat(`/objects/${id}`))

        return data
    } catch (ex) {
        return null
    }
}

export * from './index.types'
