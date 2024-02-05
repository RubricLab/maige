import {Sandbox} from '@e2b/sdk'
import {ChatOpenAI} from '@langchain/openai'
import {Octokit} from '@octokit/core'
import {initializeAgentExecutorWithOptions} from 'langchain/agents'
import env from '~/env.mjs'
import prisma from '~/prisma'
import {codebaseSearch} from '~/tools/codeSearch'
import commitCode from '~/tools/commitCode'
import listFiles from '~/tools/listFiles'
import readFile from '~/tools/readFile'
import writeFile from '~/tools/writeFile'
import {getInstallationId, getInstallationToken} from '~/utils/github'
import {isDev} from '~/utils/index'

export async function engineer({
	task,
	repoFullName,
	issueNumber,
	customerId,
	projectId,
	updateEngineerTracking,
	completeEngineerTracking
}: {
	task: string
	repoFullName: string
	issueNumber: number
	customerId: string
	projectId: string
	updateEngineerTracking: (status: string) => Promise<void>
	completeEngineerTracking: (status: string) => Promise<void>
}) {
	const installationToken = await getInstallationToken(
		await getInstallationId(repoFullName)
	)

	const octokit = new Octokit({auth: installationToken})

	let tokens = {
		prompt: 0,
		completion: 0
	}

	const model = new ChatOpenAI({
		modelName: 'gpt-4-0125-preview',
		openAIApiKey: env.OPENAI_API_KEY,
		temperature: 0.3,
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

	const {content: PRTitle} = await model.call([
		'Could you output a very concise PR title for this request?',
		`Task: ${task}`
	])

	const shell = await Sandbox.create({
		apiKey: env.E2B_API_KEY,
		onStderr: data => console.error(data.line),
		onStdout: data => console.log(data.line),
		cwd: '/code'
	})

	const branch = `maige/${issueNumber}-${Date.now()}`
	const [owner, repo] = repoFullName.split('/')
	const botUserName = `${env.NEXT_PUBLIC_GITHUB_APP_NAME}[bot]` // Replace with your GitHub App's bot user name
	const botUserEmail = `${env.GITHUB_APP_ID}+${env.NEXT_PUBLIC_GITHUB_APP_NAME}[bot]@users.noreply.github.com` // Replace with your GitHub App's bot user email

	const repoSetup = `git config --global user.email "${botUserEmail}" && git config --global user.name "${botUserName}" && git clone https://x-access-token:${installationToken}@github.com/${repoFullName}.git && cd ${repo} && git checkout -b ${branch}`

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
		callbacks: [
			{
				async handleChainEnd() {
					await prisma.usage.create({
						data: {
							projectId: projectId,
							totalTokens: tokens.prompt + tokens.completion,
							promptTokens: tokens.prompt,
							completionTokens: tokens.completion,
							action: 'Create some stuff with engineer',
							agent: 'engineer',
							model: 'gpt-4-0125-preview'
						}
					})
				}
			}
		],
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
		cmd: `cd ${repo} && git push -u origin ${branch}`
	})

	try {
		await octokit.request(`POST /repos/${repoFullName}/pulls`, {
			owner,
			repo,
			title: PRTitle,
			body,
			head: branch,
			base: 'main'
		})
	} catch (e) {
		await updateEngineerTracking('failed')
	}

	await shell.close()

	await completeEngineerTracking('completed')

	return
}
