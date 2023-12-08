import {initializeAgentExecutorWithOptions} from 'langchain/agents'
import {ChatOpenAI} from 'langchain/chat_models/openai'
import env from '~/env.mjs'
import {codebaseSearch} from '~/tools/codeSearch'
import commentTool from '~/tools/comment'
import dispatchEngineer from '~/tools/dispatchEngineer'
import dispatchReviewer from '~/tools/dispatchReviewer'
import {githubTool} from '~/tools/github'
import {labelTool} from '~/tools/label'
import updateInstructionsTool from '~/tools/updateInstructions'
import {isDev} from '~/utils'

const model = new ChatOpenAI({
	modelName: 'gpt-4-1106-preview',
	openAIApiKey: env.OPENAI_API_KEY,
	temperature: 0
})

export async function maige({
	input,
	octokit,
	prisma,
	customerId,
	repoFullName,
	issueNumber,
	pullUrl,
	allLabels
}: {
	input: string
	octokit: any
	prisma: any
	customerId: string
	repoFullName: string
	issueNumber?: number
	pullUrl?: string
	allLabels: any[]
}) {
	const tools = [
		labelTool({octokit, allLabels}),
		updateInstructionsTool({octokit, prisma, customerId, repoFullName}),
		githubTool({octokit}),
		codebaseSearch({customerId, repoFullName}),
		dispatchEngineer({issueNumber, repoFullName, customerId}),
		...(issueNumber && [commentTool({octokit})]),
		...(pullUrl && [
			dispatchReviewer({octokit, pullUrl, repoFullName, customerId})
		])
	]

	const prefix = `
You are a project manager that is tagged when new issues come into GitHub.
You are responsible for labelling the issues using the GitHub API.
You also maintain a set of user instructions that can customize your behaviour; you can write to these instructions at the request of a user.
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
