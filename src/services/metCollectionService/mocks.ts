import { rest } from 'msw'

import { BASE_URL } from './metCollectionService'

const mockGetObjectsWithImages = rest.get(BASE_URL + '/search', (req, res, ctx) => {
    const mockedObjectIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    return res(ctx.status(200), ctx.json({ total: mockedObjectIds.length, objectIDs: mockedObjectIds }))
})

export const mocks = [mockGetObjectsWithImages]
