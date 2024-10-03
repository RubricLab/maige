import { ChatOpenAI } from '@langchain/openai'
import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import parse, { type Change } from 'parse-diff'
import env from '~/env'
import prisma from '~/prisma'
import { codeComment } from '~/tools/codeComment'
import { codebaseSearch } from '~/tools/codeSearch'
import { prComment } from '~/tools/prComment'
import { isDev } from '~/utils/index'

export async function reviewer({
	customerId,
	task,
	diff,
	octokit,
	repoFullName,
	pullNumber,
	pullId,
	commitId,
	runId
}: {
	customerId: string
	task: string
	diff: string
	projectId: string
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	octokit: any
	repoFullName: string
	pullNumber: number
	pullId?: string
	commitId: string
	runId: string
}) {
	let logId: string
	const model = new ChatOpenAI({
		modelName: 'gpt-4-1106-preview',
		openAIApiKey: env.OPENAI_API_KEY,
		temperature: 0.3,
		callbacks: [
			{
				async handleLLMStart() {
					const result = await prisma.log.create({
						data: {
							runId: runId,
							action: 'Coming Soon',
							agent: 'reviewer',
							model: 'gpt_4_turbo_preview'
						}
					})
					logId = result.id
				},
				async handleLLMError() {
					await prisma.log.update({
						where: {
							id: logId
						},
						data: {
							status: 'failed',
							finishedAt: new Date()
						}
					})
				},
				async handleLLMEnd(data) {
					await prisma.log.update({
						where: {
							id: logId
						},
						data: {
							status: 'completed',
							promptTokens: data?.llmOutput?.tokenUsage?.promptTokens || 0,
							completionTokens: data?.llmOutput?.tokenUsage?.completionTokens || 0,
							totalTokens:
								data?.llmOutput?.tokenUsage?.promptTokens + data?.llmOutput?.tokenUsage?.completionTokens,
							finishedAt: new Date()
						}
					})
				}
			}
		]
	})

	const prefix = `
		You are a 1000x senior engineer looking at a pull request on GitHub.
		Follow these instructions: ${task}.
		
		Think step by step.
		Limit prose. If you write too much, the author will get overwhelmed.

		{agent_scratchpad}
		`
		.replaceAll('\n', ' ')
		.replaceAll('\t', ' ')

	const files = parse(diff)
	let diffString = ''

	// Group diff by file for ease of review
	for (const file of files) {
		let changes = `File Path: ${file.from}\n\n`

		for (const chunk of file.chunks) {
			for (const change of chunk.changes as (Change & {
				ln2?: string
				ln?: string
			})[]) {
				changes += `${change.ln2 || change.ln} ${change.content}\n`
			}

			changes += `${'='.repeat(10)}\n`
		}

		diffString += `${changes + '='.repeat(20)}\n\n`
	}

	const tools = [
		codebaseSearch({ customerId, repoFullName }),
		prComment({ octokit, pullId: pullId as string }),
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

	const { output } = await executor.call({ input: diffString })

	return output
}
