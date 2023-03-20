export type SearchCollectionObjectsResponse = {
    total: number
    objectIDs: number[]
}

export type Constituent = {
    constituentID: number
    role: string
    name: string
    constituentULAN_URL: string
    constituentWikidata_URL: string
    gender: string
}

export type ElementMeasurements = {
    Height: number
    Width: number
}

export type Element = {
    elementName?: string | null
    elementDescription?: string | null
    elementMeasurements?: ElementMeasurements | null
}

export type CollectionObject = {
    objectID: number
    isHighlight?: boolean | null
    accessionNumber?: string | null
    accessionYear?: string | null
    isPublicDomain?: boolean | null
    primaryImage?: string | null
    primaryImageSmall?: string | null
    additionalImages?: string[] | null
    constituents?: Constituent[] | null
    department?: string | null
    objectName?: string | null
    title?: string | null
    culture?: string | null
    period?: string | null
    dynasty?: string | null
    reign?: string | null
    portfolio?: string | null
    artistRole?: string | null
    artistPrefix?: string | null
    artistDisplayName?: string | null
    artistDisplayBio?: string | null
    artistSuffix?: string | null
    artistAlphaSort?: string | null
    artistNationality?: string | null
    artistBeginDate?: string | null
    artistEndDate?: string | null
    artistGender?: string | null
    artistWikidata_URL?: string | null
    artistULAN_URL?: string | null
    objectDate?: string | null
    objectBeginDate?: number | null
    objectEndDate?: number | null
    medium?: string | null
    dimensions?: string | null
    measurements?: Element[] | null
    creditLine?: string | null
    geography?: string | null
}
