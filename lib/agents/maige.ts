import {initializeAgentExecutorWithOptions} from 'langchain/agents'
import {ChatOpenAI} from 'langchain/chat_models/openai'
import env from '~/env.mjs'
import {codebaseSearch} from '~/tools/codeSearch'
import commentTool from '~/tools/comment'
import dispatchEngineer from '~/tools/dispatchEngineer'
import {githubTool} from '~/tools/github'
import {labelTool} from '~/tools/label'
import updateInstructionsTool from '~/tools/updateInstructions'
import {isDev} from '~/utils'

const model = new ChatOpenAI({
	modelName: 'gpt-4-1106-preview',
	openAIApiKey: env.OPENAI_API_KEY,
	temperature: 0
})

export default async function maige({
	input,
	octokit,
	prisma,
	customerId,
	repoName,
	issueNumber,
	allLabels
}: {
	input: string
	octokit: any
	prisma: any
	customerId: string
	repoName: string
	issueNumber: number
	allLabels: any[]
}) {
	const tools = [
		commentTool({octokit}),
		updateInstructionsTool({octokit, prisma, customerId, repoName}),
		githubTool({octokit}),
		codebaseSearch({customerId, repoName}),
		dispatchEngineer({issueNumber, repo: repoName, customerId}),
		labelTool({octokit, allLabels})
	]

	const prefix = `
You are a project manager that is tagged when new issues come into GitHub.
You are responsible for labelling the issues using the GitHub API.
You also maintain a set of user instructions that can customize your behaviour; you can write to these instructions at the request of a user.
`.replaceAll('\n', ' ')

	const executor = await initializeAgentExecutorWithOptions(tools, model, {
		agentType: 'openai-functions',
		returnIntermediateSteps: isDev,
		handleParsingErrors: true,
		verbose: false,
		agentArgs: {
			prefix
		}
	})

	const result = await executor.call({input})
	const {output} = result

	return output
}
