import {Sandbox} from '@e2b/sdk'
import {Octokit} from '@octokit/core'
import {initializeAgentExecutorWithOptions} from 'langchain/agents'
import {ChatOpenAI} from 'langchain/chat_models/openai'
import env from '~/env.mjs'
import {codebaseSearch} from '~/tools/codeSearch'
import commitCode from '~/tools/commitCode'
import listFiles from '~/tools/listFiles'
import readFile from '~/tools/readFile'
import writeFile from '~/tools/writeFile'
import {isDev} from '~/utils'

const model = new ChatOpenAI({
	modelName: 'gpt-4-1106-preview',
	openAIApiKey: env.OPENAI_API_KEY,
	temperature: 0.3
})

export async function engineer({
	task,
	repoFullName,
	issueNumber,
	customerId
}: {
	task: string
	repoFullName: string
	issueNumber: number
	customerId: string
}) {
	const {content: title} = await model.call([
		'Could you output a very concise PR title for this request?',
		`Task: ${task}`
	])

	const shell = await Sandbox.create({
		apiKey: env.E2B_API_KEY,
		onStderr: data => console.error(data.line),
		onStdout: data => console.log(data.line),
		cwd: '/code'
	})

	const tokenB64 = btoa(`pat:${env.GITHUB_ACCESS_TOKEN}`)
	const authFlag = `-c http.extraHeader="AUTHORIZATION: basic ${tokenB64}"`
	const branch = `maige/${issueNumber}-${Date.now()}`
	const [owner, repo] = repoFullName.split('/')
	const repoSetup = `git config --global user.email "${env.GITHUB_EMAIL}" && git config --global user.name "${env.GITHUB_USERNAME}" && git ${authFlag} clone https://github.com/${repoFullName}.git && cd ${repo} && git checkout -b ${branch}`

	await shell.process.startAndWait({
		cmd: repoSetup
	})

	const tools = [
		readFile({shell, dir: repo}),
		listFiles({shell, dir: repo}),
		writeFile({shell, dir: repo}),
		commitCode({shell, dir: repo}),
		codebaseSearch({repoFullName, customerId})
	]

	const prefix = `You are a senior AI engineer.
You write code based on the supplied instructions.
First some context:
- The code has already been cloned to ${repo} and you are in that dir.
Your first step should be to do any necessary research to understand the problem.
Next, run the listFiles tool to see what files are in the repo.
Then you should come up with a plan of action using chain of thought.
Then you should write the code to implement the plan.
Make sure to commit as you go.
When you are finished, the code will automatically be pushed to a new branch and a pull request will be opened.
Any uncommitted changes will be discarded.
Your final output message should be the message that will be included in the pull request.
`.replaceAll('\n', ' ')

	const executor = await initializeAgentExecutorWithOptions(tools, model, {
		agentType: 'openai-functions',
		returnIntermediateSteps: isDev,
		handleParsingErrors: true,
		// verbose: true,
		agentArgs: {
			prefix
		}
	})

	const input = `${task}`
	const result = await executor.call({input})
	const {output} = result
	const body = `${output}\n\nCloses #${issueNumber}`

	// Must cd again because each process starts from ~/
	await shell.process.startAndWait({
		cmd: `cd ${repo} && git ${authFlag} push -u origin ${branch}`
	})

	const octokit = new Octokit({auth: env.GITHUB_ACCESS_TOKEN})

	await octokit.request(`POST /repos/${repoFullName}/pulls`, {
		owner,
		repo,
		title,
		body,
		head: branch,
		base: 'main'
	})

	await shell.close()

	return
}
