import axios from 'axios'

import { GetObjectResponse, SearchObjectsResponse } from './index.types'

const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1'

export async function getAllCollectionObjectsWithImages(): Promise<SearchObjectsResponse | null> {
    try {
        const { data } = await axios.get<SearchObjectsResponse>(BASE_URL.concat('/search?q=.&hasImages=true'))

        return data
    } catch (ex) {
        return null
    }
}

export async function getCollectionObjectsByQuery(q: string): Promise<SearchObjectsResponse | null> {
    try {
        const { data } = await axios.get<SearchObjectsResponse>(BASE_URL.concat(`/search?q=${encodeURIComponent(q)}&hasImages=true`))

        return data
    } catch (ex) {
        return null
    }
}

export async function getCollectionObject(id: number): Promise<GetObjectResponse | null> {
    try {
        const { data } = await axios.get<GetObjectResponse>(BASE_URL.concat(`/objects/${id}`))

        return data
    } catch (ex) {
        return null
    }
}

export * from './index.types'
