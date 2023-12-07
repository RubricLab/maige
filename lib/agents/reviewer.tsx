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
	head
}: {
	customerId: string
	input: string
	octokit: any
	pullId?: string
	repoFullName?: string
	pullNumber?: number
	head?: string
}) {
	/**
	 * Comment on a PR
	 */
	if (pullId) {
		const tools = [new SerpAPI(), codebaseSearch({customerId, repoFullName})]

		const prefix = `
		You are a 100x senior engineer summarizing a pull request on GitHub.
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
		 * New PR
		 */
		const prefix = `
		You are a 100x senior engineer reviewing code changes from a pull request on GitHub.
		Limit prose. Default to just commenting directly.
		Be moderate when commenting. Don't comment on every change.
		Only comment on serious issues, mistakes, potential breaking changes, or bad patterns.
		Think step by step.

		{agent_scratchpad}
		`.replaceAll('\n', ' ')

		let files = parse(input)

		for (const file of files) {
			let changes = `File Path: ${file.from}\n\n`

			file.chunks.forEach((chunk: Chunk) => {
				chunk.changes.forEach((change: Change & {ln2?: string; ln?: string}) => {
					changes += `${change.ln2 ? change.ln2 : change.ln} ${change.content}\n`
				})

				changes += '='.repeat(50) + '\n'
			})

			const tools = [
				codebaseSearch({customerId, repoFullName}),
				codeComment({
					octokit,
					repoFullName,
					pullNumber,
					commitId: head,
					path: file.from
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

			await executor.call({input: changes})
		}
		return
	}
}
