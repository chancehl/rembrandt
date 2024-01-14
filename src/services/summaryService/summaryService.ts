import OpenAI from 'openai'

import { logger } from '../../logger'
import { CollectionObject } from '../../types'

type ConstructorArgs = {
    openai?: OpenAI
}

export class SummaryService {
    private openai: OpenAI = new OpenAI({
        apiKey: process.env.OPEN_AI_API_KEY,
    })

    private prompt = `You are an art historian working at the Metropolitan Museum of Art. Write a brief summary (1-2 paragraphs) as if you were giving a tour of the museum describing the following piece in your collection: PIECE_IDENTIFIER. Do not introduce yourself or welcome the visitors. Only reply with information about the artwork.`

    constructor(args?: ConstructorArgs) {
        if (args?.openai) {
            this.openai = args.openai
        }
    }

    async generateSummary(object: CollectionObject) {
        logger.info(`Generating summary for object ${object.objectID}`)

        const response = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: this.generatePrompt(object),
                },
            ],
        })

        logger.info(`Generated summary for object ${object.objectID}, usage=${JSON.stringify(response.usage)}`)

        const contents = response.choices.map((choice) => choice.message.content)

        return contents.join('\n')
    }

    private generatePrompt(object: CollectionObject) {
        const tokenizedTemplate = this.prompt.replace('PIECE_IDENTIFIER', `${object.title}, ${object.medium}, ${object.department}`)

        return tokenizedTemplate
    }
}
