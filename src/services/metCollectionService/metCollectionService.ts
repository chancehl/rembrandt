import axios from 'axios'

import { CollectionObject, GetAllCollectionObjectsResponse, SearchCollectionObjectsResponse } from '../../types'
import { pickRandomElement } from '../../utils'

export const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1'

export class MetCollectionService {
    constructor() {}

    async getAllCollectionObjectsWithImages(): Promise<SearchCollectionObjectsResponse> {
        const response = await axios.get<SearchCollectionObjectsResponse>(BASE_URL.concat('/search?q=.&hasImages=true'))

        return response.data
    }

    async getCollectionObjectsByQuery(q: string): Promise<SearchCollectionObjectsResponse> {
        const response = await axios.get<SearchCollectionObjectsResponse>(BASE_URL.concat(`/search?q=${encodeURIComponent(q)}&hasImages=true`))

        return response.data
    }

    async getCollectionObject(id: number): Promise<CollectionObject> {
        const response = await axios.get<CollectionObject>(BASE_URL.concat(`/objects/${id}`))

        return response.data
    }

    async getAllCollectionObjects(): Promise<GetAllCollectionObjectsResponse> {
        const response = await axios.get<GetAllCollectionObjectsResponse>(BASE_URL.concat(`/objects`))

        return response.data
    }

    async getRandomCollectionObject(query?: string): Promise<CollectionObject> {
        // get all collection object ids
        // prettier-ignore
        const objects = query == null 
            ? await this.getAllCollectionObjectsWithImages() 
            : await this.getCollectionObjectsByQuery(query)

        // pick a random element
        const objectId = pickRandomElement(objects.objectIDs ?? [])

        // get a specific object
        const object = await this.getCollectionObject(objectId)

        return object
    }
}
