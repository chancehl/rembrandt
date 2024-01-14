import OpenAI from 'openai'

import { logger } from '../../logger'
import { CollectionObject } from '../../types'

type ConstructorArgs = {
    openai?: OpenAI
}

export class SummaryService {
    private openai: OpenAI = new OpenAI({
        organization: process.env.OPEN_AI_ORGANIZATON_ID,
        apiKey: process.env.OPEN_AI_API_KEY,
    })

    private prompt = `You are an art historian working at the Metropolitan Museum of Art. Write a brief summary (as if you were giving a tour of the museum) describing the following piece in your collection: PIECE_IDENTIFIER.`

    constructor(args?: ConstructorArgs) {
        if (args?.openai) {
            this.openai = args.openai
        }
    }

    async generateSummary(object: CollectionObject) {
        logger.info(`Generating summary for object ${object.objectID}`)

        const response = await this.openai.completions.create({
            model: 'gpt-3.5-turbo',
            prompt: this.generatePrompt(object),
        })

        logger.info(`Generated summary for object ${object.objectID}, usage=${JSON.stringify(response.usage)}`)

        const contents = response.choices.map((choice) => choice.text)

        return contents.join('\n')
    }

    private generatePrompt(object: CollectionObject) {
        const tokenizedTemplate = this.prompt.replace('PIECE_IDENTIFIER', `${object.title}, ${object.medium}, ${object.department}`)

        return tokenizedTemplate
    }
}
