import {Sandbox} from '@e2b/sdk'
import {initializeAgentExecutorWithOptions} from 'langchain/agents'
import {ChatOpenAI} from 'langchain/chat_models/openai'
import {SerpAPI} from 'langchain/tools'
import {env} from '~/env.mjs'
import commentTool from '~/tools/comment'
import exec from '~/tools/exec'
import github from '~/tools/github'
import updateInstructions from '~/tools/updateInstructions'
import {isDev} from '~/utils'

const model = new ChatOpenAI({
	modelName: 'gpt-4-1106-preview',
	openAIApiKey: env.OPENAI_API_KEY,
	temperature: 0
})

export default async function engineer({
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
	const shell = await Sandbox.create({
		apiKey: env.E2B_API_KEY,
		onStderr: data => console.error(data.line),
		onStdout: data => console.log(data.line)
	})

	const tools = [
		new SerpAPI(),
		commentTool({octokit}),
		updateInstructions({octokit, prisma, customerId, owner}),
		github({octokit}),
		exec({
			name: 'shell',
			description: 'Executes a shell command.',
			shell
		}),
		exec({
			name: 'git',
			description:
				'Executes a shell command with git logged in. Commands must begin with "git ".',
			setupCmd: `git config --global user.email "${env.GITHUB_BOT_EMAIL}" && git config --global user.name "${env.GITHUB_BOT_USERNAME}"`,
			preCmdCallback: (cmd: string) => {
				const tokenB64 = btoa(`pat:${env.GITHUB_BOT_ACCESS_TOKEN}`)
				const authFlag = `-c http.extraHeader="AUTHORIZATION: basic ${tokenB64}"`

				// Replace only first occurrence to avoid prompt injection
				// Otherwise "git log && echo 'git '" would print the token
				return cmd.replace('git ', `git ${authFlag} `)
			},
			shell
		})
	]

	const prefix = `You are a senior AI engineer.
You use the internet, shell, and git to solve problems.
You like to read the docs.
Only use necessary tools.
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

	await shell.close()

	return output
}
