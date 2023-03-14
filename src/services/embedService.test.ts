import { EmbedBuilder } from '@discordjs/builders'
import { EmbedService } from './embedService'

describe('EmbedService', () => {
    const testEmbedBuilder = new EmbedBuilder()

    test('sets the title when one is present on the object', () => {
        const titleSpy = jest.spyOn(testEmbedBuilder, 'setTitle')

        EmbedService.generateEmbedFromObject({ object: { objectID: -1, title: 'title' }, builder: testEmbedBuilder })

        expect(titleSpy).toHaveBeenCalledTimes(1)
        expect(titleSpy).toHaveBeenCalledWith('title')
    })
})
