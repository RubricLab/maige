import {LLMChain} from 'langchain/chains'
import {OpenAI} from 'langchain/llms/openai'
import {PromptTemplate} from 'langchain/prompts'

const prompt = PromptTemplate.fromTemplate(
	`You are AI that make desc of code snippet. Many keywords, straight to point, 1 line.

    Code:#!/bin/sh\ngroovyc src/*.groovy\ngroovy src/Main.groovy --cp src/
    AI:Compiles and runs a Groovy program using the source files in the \"src\" directory.

    Code:{code}
    AI:`
)

export async function AISummary(
	code: string,
	modelName: string = 'gpt-3.5-turbo',
	temperature: number = 0
) {
	const model = new OpenAI({temperature, modelName})
	const codeChain = new LLMChain({
		llm: model,
		prompt
	})

	return await codeChain.call({code})
}
