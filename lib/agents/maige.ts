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
import {isDev} from '~/utils/index'

export async function maige({
	input,
	octokit,
	customerId,
	projectId,
	repoFullName,
	issueNumber,
	issueId,
	pullUrl,
	allLabels,
	comment,
	beta
}: {
	input: string
	octokit: any
	customerId: string
	projectId: string
	repoFullName: string
	issueNumber?: number
	issueId?: string
	pullUrl?: string
	allLabels: any[]
	comment: any
	beta?: boolean
}) {
	let tokens = {
		prompt: 0,
		completion: 0
	}

	const model = new ChatOpenAI({
		modelName: 'gpt-4-1106-preview',
		openAIApiKey: env.OPENAI_API_KEY,
		temperature: 0,
		streaming: false,
		callbacks: [
			{
				async handleLLMEnd(data) {
					tokens = {
						prompt: tokens.prompt + (data?.llmOutput?.tokenUsage?.promptTokens || 0),
						completion:
							tokens.completion + (data?.llmOutput?.tokenUsage?.completionTokens || 0)
					}
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
			instructionCreator: comment?.user?.login,
			instructionCommentLink: comment?.html_url
		}),
		githubTool({octokit}),
		codebaseSearch({customerId, repoFullName}),
		...(issueId
			? [
					commentTool({octokit, issueId}),
					dispatchEngineer({issueNumber, repoFullName, customerId, projectId})
				]
			: []),
		...(pullUrl && beta
			? [dispatchReviewer({octokit, pullUrl, repoFullName, customerId, projectId})]
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
		},
		callbacks: [
			{
				async handleChainEnd() {
					await prisma.usage.create({
						data: {
							projectId: projectId,
							totalTokens: tokens.prompt + tokens.completion,
							promptTokens: tokens.prompt,
							completionTokens: tokens.completion,
							action: 'Review an issue with maige',
							agent: 'maige',
							model: 'gpt-4-1106-preview'
						}
					})
				}
			}
		]
	})

	const {output} = await executor.call({input})

	return output
}
