import fs from 'fs'
import path from 'path'
import { Configuration, OpenAIApi } from 'openai'

import { CollectionObject } from '../../types'

export class SummaryService {
    constructor() {}

    async generateSummary(object: CollectionObject) {
        const configuration = new Configuration({
            organization: process.env.OPEN_AI_ORGANIZATON_ID,
            apiKey: process.env.OPEN_AI_API_KEY,
        })

        const openai = new OpenAIApi(configuration)

        const prompt = this.generatePrompt(object)

        const response = await openai.createChatCompletion({
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-3.5-turbo',
        })

        const summary = response.data.choices.map((choice) => choice.message?.content).join('\n')

        return summary
    }

    private generatePrompt(object: CollectionObject) {
        const template = fs.readFileSync(path.join(__dirname, './prompt.txt'), { encoding: 'utf-8' })

        const tokenizedTemplate = template.replace('PIECE_IDENTIFIER', `${object.title}, ${object.medium}, ${object.department}`)

        return tokenizedTemplate
    }
}
