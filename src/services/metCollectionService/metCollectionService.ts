import axios from 'axios'

import { CollectionObject, GetAllCollectionObjectsResponse, SearchCollectionObjectsResponse } from '../../types'
import { pickRandomElement } from '../../utils'
import { logger } from '../../logger'

export const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1'

export class MetCollectionService {
    private missingImageCache // TODO: replace this with redis

    constructor(missingImageCache?: number[]) {
        this.missingImageCache = missingImageCache ?? []
    }

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

        // get a specific object
        const object = this.pickAndFetchRandomObject(objects.objectIDs ?? [])

        return object
    }

    private async pickAndFetchRandomObject(objectIds: number[]): Promise<CollectionObject> {
        // filter out things we know are missing images
        const validObjectIds = objectIds.filter((id) => !this.missingImageCache.includes(id))

        let object = await this.getCollectionObject(pickRandomElement(validObjectIds))

        while (object.primaryImage == null || object.primaryImage.length === 0) {
            logger.warn(`Object ${object.objectID} had a missing primary image, retrying`)

            this.missingImageCache.push(object.objectID)

            object = await this.getCollectionObject(pickRandomElement(objectIds))
        }

        return object
    }
}
