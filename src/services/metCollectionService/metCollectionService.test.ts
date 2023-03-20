import { MetCollectionService } from './metCollectionService'

describe('MetCollectionService', () => {
    const service = new MetCollectionService()

    describe('getAllCollectionObjectsWithImages', () => {
        test('returns a list of object ids', async () => {
            const response = await service.getAllCollectionObjectsWithImages()

            expect(response.objectIDs).not.toBeNull()
            expect(response.total).toEqual(response.objectIDs.length)
        })
    })
})
