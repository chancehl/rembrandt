import axios from 'axios'

const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1/'

type GetObjectIDsResponse = {
    total: number
    objectIDs: number[]
}

type GetObjectResponse = {}

export async function getObjectIds(): Promise<GetObjectIDsResponse | null> {
    try {
        const response = await axios.get<GetObjectIDsResponse>(BASE_URL.concat('/objects'))

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
