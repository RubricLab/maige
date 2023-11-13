import {initializeAgentExecutorWithOptions} from 'langchain/agents'
import {ChatOpenAI} from 'langchain/chat_models/openai'
import {env} from '~/env.mjs'
import commentTool from '~/tools/comment'
// import labelIssueTool from '~/tools/label'
import updateInstructions from '~/tools/updateInstructions'
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
	const prefix = `You are Maige, a helpful github assistant that is notified anytime an issue is created or updated on github. You are responsible for labeling and triaging these issues according to the repo's preferences.`

	const tools = [
		commentTool({octokit}),
		updateInstructions({octokit, prisma, customerId, owner})
		// labelIssueTool({octokit, allLabels: [{id: '1', name: '1', description: '1'}]})
	]
	const executor = await initializeAgentExecutorWithOptions(tools, model, {
		agentType: 'openai-functions',
		returnIntermediateSteps: isDev,
		handleParsingErrors: true,
		verbose: isDev,
		agentArgs: {
			prefix
		}
	})

	const {output} = await executor.call({input})

	return output
}
