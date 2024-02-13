import {ChatOpenAI} from '@langchain/openai'
import {initializeAgentExecutorWithOptions} from 'langchain/agents'
import env from '~/env.mjs'
import prisma from '~/prisma'
import {codebaseSearch} from '~/tools/codeSearch'
import commentTool from '~/tools/comment'
import dispatchEngineer from '~/tools/dispatchEngineer'
import dispatchReviewer from '~/tools/dispatchReviewer'
import {githubTool} from '~/tools/github'
import {labelTool} from '~/tools/label'
import updateInstructionsTool from '~/tools/updateInstructions'
import {Comment} from '~/types'
import {isDev} from '~/utils/index'

export async function maige({
	input,
	octokit,
	runId,
	customerId,
	projectId,
	defaultBranch,
	repoFullName,
	issueNumber,
	issueId,
	pullUrl,
	allLabels,
	comment,
	beta,
	teamSlug
}: {
	input: string
	octokit: any
	runId: string
	customerId: string
	projectId: string
	defaultBranch: string
	repoFullName: string
	issueNumber?: number
	issueId?: string
	pullUrl?: string
	allLabels: any[]
	comment: Comment
	beta?: boolean
	teamSlug?: string
}) {
	let logId: string

	const model = new ChatOpenAI({
		modelName: 'gpt-4-turbo-preview',
		openAIApiKey: env.OPENAI_API_KEY,
		temperature: 0,
		streaming: false,
		callbacks: [
			{
				async handleLLMStart() {
					const result = await prisma.log.create({
						data: {
							runId: runId,
							action: 'Coming Soon',
							agent: 'labeler',
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
								data?.llmOutput?.tokenUsage?.promptTokens +
								data?.llmOutput?.tokenUsage?.completionTokens,
							finishedAt: new Date()
						}
					})
				}
			}
		]
	})

	const tools = [
		labelTool({octokit, allLabels, issueId}),
		updateInstructionsTool({
			octokit,
			prisma,
			customerId,
			issueId,
			repoFullName,
			instructionCreator: comment?.name,
			instructionCommentLink: comment?.html_url
		}),
		githubTool({octokit}),
		...(customerId ? [codebaseSearch({customerId, repoFullName})] : []),
		dispatchEngineer({
			runId,
			issueId,
			issueNumber,
			repoFullName,
			defaultBranch,
			customerId,
			projectId,
			teamSlug
		}),
		...(issueId ? [commentTool({octokit, issueId})] : []),
		...(pullUrl && beta && customerId
			? [
					dispatchReviewer({
						runId,
						octokit,
						pullUrl,
						repoFullName,
						customerId,
						projectId
					})
				]
			: [])
	]

	const prefix = `
You are a project manager that is tagged when new issues and PRs come into GitHub.
${
	pullUrl ? '' : 'You are responsible for labelling issues using the GitHub API.'
}
You also maintain a set of user instructions that can customize your behaviour; you can write to these instructions at the request of a user.
All repo labels: ${allLabels
		.map(
			({name, description}) =>
				`${name}${description ? `: ${description.replaceAll(';', ',')}` : ''}`
		)
		.join('; ')}.
`
		.replaceAll('\n', ' ')
		.replaceAll('\t', ' ')

	const executor = await initializeAgentExecutorWithOptions(tools, model, {
		agentType: 'openai-functions',
		returnIntermediateSteps: isDev,
		handleParsingErrors: true,
		// verbose: true,
		agentArgs: {
			prefix
		}
	})

	const {output} = await executor.call({input})

	return output
}
