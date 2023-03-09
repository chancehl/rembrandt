export type SearchObjectsResponse = {
    total: number
    objectIDs: number[]
}

export type GetObjectResponse = MetApiObject

export type MetApiObject = Partial<Object> & { objectID: number }

// This was generated using ChatGPT. TODO: validate fields & make appropriate values nullable
type Object = {
    objectID: number
    isHighlight: boolean
    accessionNumber: string
    accessionYear: string
    isPublicDomain: boolean
    primaryImage: string
    primaryImageSmall: string
    additionalImages: string[]
    constituents: {
        constituentID: number
        role: string
        name: string
        constituentULAN_URL: string
        constituentWikidata_URL: string
        gender: string
    }[]
    department: string
    objectName: string
    title: string
    culture: string
    period: string
    dynasty: string
    reign: string
    portfolio: string
    artistRole: string
    artistPrefix: string
    artistDisplayName: string
    artistDisplayBio: string
    artistSuffix: string
    artistAlphaSort: string
    artistNationality: string
    artistBeginDate: string
    artistEndDate: string
    artistGender: string
    artistWikidata_URL: string
    artistULAN_URL: string
    objectDate: string
    objectBeginDate: number
    objectEndDate: number
    medium: string
    dimensions: string
    measurements: {
        elementName: string
        elementDescription: string | null
        elementMeasurements: {
            Height: number
            Width: number
        }
    }[]
    creditLine: string
    geography: string
}
