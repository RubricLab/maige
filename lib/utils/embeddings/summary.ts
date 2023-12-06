import {LLMChain} from 'langchain/chains'
import {OpenAI} from 'langchain/llms/openai'
import {PromptTemplate} from 'langchain/prompts'

const prompt = PromptTemplate.fromTemplate(
	`You are a helpful assistant that writes a description of the given code snippet. My ultimate goal is to use your produced summary as a key in a key value store vectordb. Your summary is the key and the value is the code.
    1) Don't mention "code snippet" or "summary" in your response. Just produce the summary of just the code without fluff.
    2) Try to summarize the code in no more than 6 sentences and use as many keywords as possible.
    3) Your response should be a single line of text.

    Example Code: #!/bin/sh\ngroovyc src/*.groovy\ngroovy src/Main.groovy --cp src/
    Good Summary: Compiles and runs a Groovy program using the source files in the \"src\" directory.

    {code}`
)

export async function AISummary(code: string, modelName: string = 'gpt-3.5-turbo', temperature: number = 0) {
	const model = new OpenAI({temperature, modelName})
	const codeChain = new LLMChain({llm: model, prompt})
	return await codeChain.call({code})
}
