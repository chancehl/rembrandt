import axios from 'axios'

import { GetCollectionObjectResponse, SearchCollectionObjectsResponse } from '../../types'

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
