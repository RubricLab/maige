import {initializeAgentExecutorWithOptions} from 'langchain/agents'
import {ChatOpenAI} from 'langchain/chat_models/openai'
import {SerpAPI} from 'langchain/tools'
import env from '~/env.mjs'
import commentTool from '~/tools/comment'
import githubTool from '~/tools/github'
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
	owner
}: {
	input: string
	octokit: any
	prisma: any
	customerId: string
	owner: string
}) {
	const tools = [
		new SerpAPI(),
		commentTool({octokit}),
		updateInstructionsTool({octokit, prisma, customerId, owner}),
		githubTool({octokit})
	]

	const prefix = `
You are a project manager that is tagged when new issues come into github.
You are responsible for labelling the issues using the Github API.
You also maintain a set of user instructions that can customize your behaviour; you can write to these instructions at the request of a user.
{agent_scratchpad}
`.replaceAll('\n', ' ')

	const executor = await initializeAgentExecutorWithOptions(tools, model, {
		agentType: 'openai-functions',
		returnIntermediateSteps: isDev,
		handleParsingErrors: true,
		verbose: isDev,
		agentArgs: {
			prefix
		}
	})

	const result = await executor.call({input})
	const {output} = result

	return output
}
