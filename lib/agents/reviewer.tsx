import {initializeAgentExecutorWithOptions} from 'langchain/agents'
import {ChatOpenAI} from 'langchain/chat_models/openai'
import {SerpAPI} from 'langchain/tools'
import env from '~/env.mjs'
import {codebaseSearch} from '~/tools/codeSearch'
import pr_comment from '~/tools/pr-comment'
import {isDev} from '~/utils'

const model = new ChatOpenAI({
	modelName: 'gpt-4-1106-preview',
	openAIApiKey: env.OPENAI_API_KEY,
	temperature: 0.3
})

export default async function reviewer({
	input,
	octokit,
	pullId,
}: {
	input: string
	octokit: any
	pullId: string
}) {

	const tools = [
		new SerpAPI(),
        pr_comment({octokit, pullId}),
	]

    const prefix = `
	You are senior engineer reviewing a Pull Request in GitHub made by a junior engineer.
	You MUST leave a comment on the PR according to the user's instructions using the prComment function.
    Format your answer beautifully using markdown suitable for GitHub.
    DO NOT use any emojis or non-Ascii characters.
    {agent_scratchpad}
	`.replaceAll('\n', ' ')

	const executor = await initializeAgentExecutorWithOptions(tools, model, {
		agentType: 'openai-functions',
		returnIntermediateSteps: isDev,
		handleParsingErrors: true,
		// verbose: isDev,
		agentArgs: {
			prefix
		}
	})

	const result = await executor.call({input})
	const {output} = result

	return output
}
