import fs from 'fs'
import path from 'path'
import { Configuration, OpenAIApi } from 'openai'

import { CollectionObject } from '../../types'

export class SummaryService {
    private createObjectSummaryPrompt = `Pretend you are a discord bot named "Rembrandt" whose job is to teach a discord server about random pieces of art from the Metropolitan Museum of Art collection. Write a short but informational overview about this piece of art: PIECE_IDENTIFIER. Please speak in first person and do not mention the fact that you are a bot.`

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
        const template = this.createObjectSummaryPrompt

        const tokenizedTemplate = template.replace('PIECE_IDENTIFIER', `${object.title}, ${object.medium}, ${object.department}`)

        return tokenizedTemplate
    }
}
