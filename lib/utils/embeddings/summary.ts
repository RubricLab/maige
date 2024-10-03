import { PromptTemplate } from '@langchain/core/prompts'
import { OpenAI } from '@langchain/openai'
import { LLMChain } from 'langchain/chains'

const prompt = PromptTemplate.fromTemplate(
	`You are AI that make desc of code snippet. Many keywords, straight to point, 1 line.

    Code:#!/bin/sh\ngroovyc src/*.groovy\ngroovy src/Main.groovy --cp src/
    AI:Compiles and runs a Groovy program using the source files in the \"src\" directory.

    Code:{code}
    AI:`
)

export async function AISummary(code: string, modelName = 'gpt-3.5-turbo', temperature = 0) {
	const model = new OpenAI({ temperature, modelName })
	const codeChain = new LLMChain({
		llm: model,
		prompt
	})

	return await codeChain.call({ code })
}
