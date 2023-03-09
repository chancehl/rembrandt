import axios from 'axios'

import { GetObjectResponse, SearchObjectsResponse } from './metApiService.types'

const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1'

export async function getAllObjectsWithImages(): Promise<SearchObjectsResponse | null> {
    try {
        const response = await axios.get<SearchObjectsResponse>(BASE_URL.concat('/search?q=.&hasImages=true'))

        return response.data
    } catch (ex) {
        return null
    }
}

export async function getObjectsByQuery(q: string): Promise<SearchObjectsResponse | null> {
    try {
        const response = await axios.get<SearchObjectsResponse>(BASE_URL.concat(`/search?q=${encodeURIComponent(q)}&hasImages=true`))

        return response.data
    } catch (ex) {
        return null
    }
}

export async function getObject(id: number): Promise<GetObjectResponse | null> {
    try {
        const response = await axios.get<GetObjectResponse>(BASE_URL.concat(`/objects/${id}`))

        return response.data
    } catch (ex) {
        return null
    }
}
