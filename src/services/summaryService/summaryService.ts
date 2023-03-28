import { Configuration as OpenAIApiConfiguration, OpenAIApi } from 'openai'

import { logger } from '../../logger'
import { CollectionObject } from '../../types'

export class SummaryService {
    private createObjectSummaryPrompt = `Write a summary (like you'd seed on a placard at a museum) for the Metropolitan Museum of Art collection piece: PIECE_IDENTIFIER.`

    constructor() {}

    async generateSummary(object: CollectionObject) {
        const openai = new OpenAIApi(
            new OpenAIApiConfiguration({
                organization: process.env.OPEN_AI_ORGANIZATON_ID,
                apiKey: process.env.OPEN_AI_API_KEY,
            }),
        )

        logger.info(`Generating summary for object ${object.objectID}`)

        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: this.generatePrompt(object),
                },
            ],
        })

        logger.info(`Generated summary for object ${object.objectID}, usage=${JSON.stringify(response.data.usage)}`)

        const contents = response.data.choices.map((choice) => choice.message?.content)

        return contents.join('\n')
    }

    private generatePrompt(object: CollectionObject) {
        const tokenizedTemplate = this.createObjectSummaryPrompt.replace('PIECE_IDENTIFIER', `${object.title}, ${object.medium}, ${object.department}`)

        return tokenizedTemplate
    }
}
