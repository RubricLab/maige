import {initializeAgentExecutorWithOptions} from 'langchain/agents'
import {ChatOpenAI} from 'langchain/chat_models/openai'
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
	task,
	diff,
	octokit,
	repoFullName,
	pullNumber,
	pullId,
	commitId
}: {
	customerId: string
	task: string
	diff: string
	octokit: any
	repoFullName: string
	pullNumber: number
	pullId?: string
	commitId: string
}) {
	/**
	 * New or updated PR
	 */
	const prefix = `
		You are a 1000x senior engineer looking at a pull request on GitHub.
		Follow these instructions: ${task}.
		
		Think step by step.
		Limit prose. If you write too much, the author will get overwhelmed.

		{agent_scratchpad}
		`
		.replaceAll('\n', ' ')
		.replaceAll('\t', ' ')

	let files = parse(diff)
	let diffString = ''

	// Group diff by file for ease of review
	files.forEach((file: any) => {
		let changes = `File Path: ${file.from}\n\n`

		file.chunks.forEach((chunk: Chunk) => {
			chunk.changes.forEach((change: Change & {ln2?: string; ln?: string}) => {
				changes += `${change.ln2 || change.ln} ${change.content}\n`
			})

			changes += '='.repeat(10) + '\n'
		})

		diffString += changes + '='.repeat(20) + '\n\n'
	})

	const tools = [
		codebaseSearch({customerId, repoFullName}),
		prComment({octokit, pullId}),
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
		// verbose: true,
		agentArgs: {
			prefix
		}
	})

	const {output} = await executor.call({input: diffString})

	return output
}
