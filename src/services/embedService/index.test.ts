import { EmbedBuilder } from '@discordjs/builders'

import { generateEmbedFromObject } from './index'

describe('EmbedService', () => {
    const testEmbedBuilder = new EmbedBuilder()

    test('sets the title when one is present on the object', () => {
        const titleSpy = jest.spyOn(testEmbedBuilder, 'setTitle')

        generateEmbedFromObject({ object: { objectID: -1, title: 'title' }, builder: testEmbedBuilder })

        expect(titleSpy).toHaveBeenCalledTimes(1)
        expect(titleSpy).toHaveBeenCalledWith('title')
    })

    test('sets the description when the artist display name is present on the object', () => {
        const descriptionSpy = jest.spyOn(testEmbedBuilder, 'setDescription')

        generateEmbedFromObject({ object: { objectID: -1, artistDisplayName: 'chance' }, builder: testEmbedBuilder })

        expect(descriptionSpy).toHaveBeenCalledTimes(1)
        expect(descriptionSpy).toHaveBeenCalledWith('by chance')
    })

    test('sets the image when the primary image name is present on the object', () => {
        const imageSpy = jest.spyOn(testEmbedBuilder, 'setImage')

        generateEmbedFromObject({ object: { objectID: -1, primaryImage: 'https://not-a-real-site.com/img.png' }, builder: testEmbedBuilder })

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
        }

        generateEmbedFromObject({ object: { objectID: -1, ...relevantData }, builder: testEmbedBuilder })

        expect(fieldSpy).toHaveBeenCalledTimes(Object.keys(relevantData).length)
    })
})
