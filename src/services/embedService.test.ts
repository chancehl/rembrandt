import { EmbedBuilder } from '@discordjs/builders'
import { EmbedService } from './embedService'

describe('EmbedService', () => {
    const testEmbedBuilder = new EmbedBuilder()

    test('sets the title when one is present on the object', () => {
        const titleSpy = jest.spyOn(testEmbedBuilder, 'setTitle')

        EmbedService.generateEmbedFromObject({ object: { objectID: -1, title: 'title' }, builder: testEmbedBuilder })
        EmbedService.generateEmbedFromObject({ object: { objectID: -1, title: undefined }, builder: testEmbedBuilder })

        expect(titleSpy).toHaveBeenCalledTimes(1)
        expect(titleSpy).toHaveBeenCalledWith('title')
    })

    test('sets the description when the artist display name is present on the object', () => {
        const descriptionSpy = jest.spyOn(testEmbedBuilder, 'setDescription')

        EmbedService.generateEmbedFromObject({ object: { objectID: -1, artistDisplayName: 'chance' }, builder: testEmbedBuilder })
        EmbedService.generateEmbedFromObject({ object: { objectID: -1, artistDisplayName: undefined }, builder: testEmbedBuilder })
        expect(descriptionSpy).toHaveBeenCalledTimes(1)
        expect(descriptionSpy).toHaveBeenCalledWith('by chance')
    })

    test('sets the image when the primary image name is present on the object', () => {
        const imageSpy = jest.spyOn(testEmbedBuilder, 'setImage')

        EmbedService.generateEmbedFromObject({ object: { objectID: -1, primaryImage: 'https://not-a-real-site.com/img.png' }, builder: testEmbedBuilder })
        EmbedService.generateEmbedFromObject({ object: { objectID: -1, primaryImage: undefined }, builder: testEmbedBuilder })

        expect(imageSpy).toHaveBeenCalledTimes(1)
        expect(imageSpy).toHaveBeenCalledWith('https://not-a-real-site.com/img.png')
    })
})
