import { EmbedBuilder } from '@discordjs/builders'

import { EmbedService } from './index'

describe('EmbedService', () => {
    const testEmbedBuilder = new EmbedBuilder()
    const embedService = new EmbedService({ builder: testEmbedBuilder })

    test('sets the title when one is present on the object', () => {
        const titleSpy = jest.spyOn(testEmbedBuilder, 'setTitle')

        embedService.create({ objectID: -1, title: 'title' })

        expect(titleSpy).toHaveBeenCalledTimes(1)
        expect(titleSpy).toHaveBeenCalledWith('title')
    })

    test('sets the description when the artist display name is present on the object', () => {
        const descriptionSpy = jest.spyOn(testEmbedBuilder, 'setDescription')

        embedService.create({ objectID: -1, artistDisplayName: 'chance' })

        expect(descriptionSpy).toHaveBeenCalledTimes(1)
        expect(descriptionSpy).toHaveBeenCalledWith('by chance')
    })

    test('sets the image when the primary image name is present on the object', () => {
        const imageSpy = jest.spyOn(testEmbedBuilder, 'setImage')

        embedService.create({ objectID: -1, primaryImage: 'https://not-a-real-site.com/img.png' })

        expect(imageSpy).toHaveBeenCalledTimes(1)
        expect(imageSpy).toHaveBeenCalledWith('https://not-a-real-site.com/img.png')
    })

    test('sets the fields for each relevant property on the object', () => {
        const fieldSpy = jest.spyOn(testEmbedBuilder, 'addFields')

        // each of these should trigger addField
        const relevantData = {
            objectDate: '573',
            department: 'Egyptian art',
            dimensions: "10' x 10' x 5'",
            primaryImage: 'https://not-a-real-image.com/fake.png',
        }

        embedService.create({ objectID: -1, ...relevantData })

        expect(fieldSpy).toHaveBeenCalledTimes(Object.keys(relevantData).length)
    })
})
