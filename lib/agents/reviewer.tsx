import {initializeAgentExecutorWithOptions} from 'langchain/agents'
import {ChatOpenAI} from 'langchain/chat_models/openai'
import {SerpAPI} from 'langchain/tools'
import parse, {Change, Chunk} from 'parse-diff'
import env from '~/env.mjs'
import {codeComment} from '~/tools/codeComment'
import {codebaseSearch} from '~/tools/codeSearch'
import {prComment} from '~/tools/prComment'
import {isDev} from '~/utils'

const model = new ChatOpenAI({
	modelName: 'gpt-4-1106-preview',
	openAIApiKey: env.OPENAI_API_KEY,
	temperature: 0.3
})

export async function reviewer({
	customerId,
	input,
	octokit,
	pullId,
	repoFullName,
	pullNumber,
	commitId
}: {
	customerId: string
	input: string
	octokit: any
	pullId?: string
	repoFullName?: string
	pullNumber?: number
	commitId?: string
}) {
	/**
	 * Comment on a PR
	 */
	if (pullId) {
		const tools = [new SerpAPI(), codebaseSearch({customerId, repoFullName})]

		const prefix = `
		You are a 1000x senior engineer summarizing a pull request on GitHub.
		Provide a high-level summary (maximum 5 sentences) of the diff.
		If you write too much, the author will get overwhelmed.
		Limit prose.

		{agent_scratchpad}
		`.replaceAll('\n', ' ')

		const executor = await initializeAgentExecutorWithOptions(tools, model, {
			agentType: 'openai-functions',
			returnIntermediateSteps: isDev,
			handleParsingErrors: true,
			verbose: true,
			agentArgs: {
				prefix
			}
		})

		const result = await executor.call({input})

		// Forcefully call the prComment tool
		await prComment({octokit, pullId}).func({
			comment: result.output
		})

		return
	} else {
		/**
		 * New or updated PR
		 */
		const prefix = `
		You are a 1000x senior engineer reviewing a pull request on GitHub.
		Only comment on modified code.
		Only flag the top few issues: bad patterns, clear mistakes, or potential breaking changes.
		If it looks like new code is unused, try searching for it.
		Think step by step.
		Limit prose. If you write too much, the author will get overwhelmed.

		{agent_scratchpad}
		`.replaceAll('\n', ' ')

		let files = parse(input)
		let diff = ''

		files.forEach((file: any) => {
			let changes = `File Path: ${file.from}\n\n`

			file.chunks.forEach((chunk: Chunk) => {
				chunk.changes.forEach((change: Change & {ln2?: string; ln?: string}) => {
					changes += `${change.ln2 || change.ln} ${change.content}\n`
				})

				changes += '='.repeat(10) + '\n'
			})

			diff += changes + '='.repeat(20) + '\n\n'
		})

		const tools = [
			codebaseSearch({customerId, repoFullName}),
			codeComment({
				octokit,
				repoFullName,
				pullNumber,
				commitId
			})
		]

		const executor = await initializeAgentExecutorWithOptions(tools, model, {
			agentType: 'openai-functions',
			returnIntermediateSteps: isDev,
			handleParsingErrors: true,
			verbose: true,
			agentArgs: {
				prefix
			}
		})

		await executor.call({input: diff})

		return
	}
}
