import axios from 'axios'

import { CollectionObject, GetAllCollectionObjectsResponse, SearchCollectionObjectsResponse } from '../../types'
import { pickRandomElement } from '../../utils'
import { logger } from '../../logger'
import { BANNED_OBJECTS } from '../../constants'

export const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1'

export class MetCollectionService {
    private invalidObjectCache // TODO: replace this with redis

    constructor(invalidObjectCache?: number[]) {
        this.invalidObjectCache = invalidObjectCache ?? []
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
        // filter out things we know are invalid
        const validObjectIds = objectIds.filter((id) => !this.invalidObjectCache.includes(id))

        let object = await this.getCollectionObject(pickRandomElement(validObjectIds))

        while (this.objectIsMissingImage(object) || this.objectIsBanned(object)) {
            logger.warn(`Invalid object: id=${object.objectID}, primaryImage=${object.primaryImage}, title=${object.title}`)

            this.invalidObjectCache.push(object.objectID)

            object = await this.getCollectionObject(pickRandomElement(objectIds))
        }

        return object
    }

    private objectIsBanned(object: CollectionObject): boolean {
        const matchingBannedObject = BANNED_OBJECTS.find((bannedObject) => {
            if (bannedObject.id != null) {
                return bannedObject.id === object.objectID
            }

            return bannedObject.title === object.title
        })

        return matchingBannedObject != null
    }

    private objectIsMissingImage(object: CollectionObject): boolean {
        return object.primaryImage == null || object.primaryImage.length === 0
    }
}
