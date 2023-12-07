import {initializeAgentExecutorWithOptions} from 'langchain/agents'
import {ChatOpenAI} from 'langchain/chat_models/openai'
import {SerpAPI} from 'langchain/tools'
import parse, {Change, Chunk, File} from 'parse-diff'
import env from '~/env.mjs'
import {codeComment} from '~/tools/codeComment'
import { codebaseSearch } from '~/tools/codeSearch'
import {prComment} from '~/tools/prComment'
import {isDev} from '~/utils'

const model = new ChatOpenAI({
	modelName: 'gpt-4-1106-preview',
	openAIApiKey: env.OPENAI_API_KEY,
	temperature: 0.3
})

export default async function reviewer({
	customerId,
	input,
	octokit,
	pullId,
	owner,
	repoName,
	pullNumber,
	head
}: {
	customerId: string
	input: string
	octokit: any
	pullId?: string
	owner?: string
	repoName?: string
	pullNumber?: number
	head?: string
}) {
	if (pullId) {
		const tools = [new SerpAPI(), codebaseSearch({customerId, repoName})]

		const prefix = `
		You are senior engineer named Maige that is answering questions about a Pull Request on GitHub. Try to keep it somewhat short
		and don't add fluff to it. Keep the tone neutral and do not include any expressions of gratitude or personal names, Just give the answer.
		Don't ask to leave a comment, you must do it automatically.
		DO NOT use any emojis or non-Ascii characters.

		Write your answer using direct markdown code. Make your answer easier to read and understand by using code blocks, examples, and lists/bullet points. But keep the answer as a whole concise.

		IMPORTANT TOOLS: 
		You can use the codebaseSearch function to search for code in the codebase to help you get context. It uses vector search, so consider that when using it.
		When using the codebaseSearch function, you can also specify the filePath of the file you are reviewing to get more relevant results or you can leave it blank to search the entire codebase.
		SerpAPI is a tool that can be used to search the web for information. You can use it to search for information about some code like what syntax is correct or how a function works in some language.

		Think step by step.

		{agent_scratchpad}
		`.replaceAll('\n', ' ')

		const executor = await initializeAgentExecutorWithOptions(tools, model, {
			agentType: 'openai-functions',
			returnIntermediateSteps: isDev,
			handleParsingErrors: true,
			verbose: false,
			agentArgs: {
				prefix,
			}
		})

		const result = await executor.call({input})

		// Forcefully call the prComment tool
		await prComment({octokit, pullId}).func({comment: result.output})

		return
	} else {
		const prefix = `
		You are reviewing code changes from a file from a pull request. Your goal is to provide feedback on the file through using the codeComment function to make comments only when needed such as serious issues or mistakes.
		These changes will be provided through one or more code snippets for the file. You don't need to comment on each change, only the ones that need it.
		IMPORTANT TOOLS: 
		You must specify the line number for the line you wish to comment on. If there is no reason to comment on a line then don't do anything. 
		Don't put too many comments on a file. Keep it to a minimum like 3 or 4. You can write detailed comment body instead of adding many separate comments.
		You can use the codebaseSearch function to search for code in the codebase to help you get context. It uses vector search, so consider that when using it.
		When using the codebaseSearch function, you can also specify the filePath of the file you are reviewing to get more relevant results or you can leave it blank to search the entire codebase.

		Think step by step.

		{agent_scratchpad}
		`.replaceAll('\n', ' ')

		let files = parse(input)

		files.forEach(async (file: File) => {
			var changes = `File Path: ${file.from}\n\n`;
			file.chunks.forEach((chunk: Chunk) => {
				chunk.changes.forEach((change: Change & {ln2?: string; ln?: string}) => {
					changes += `${change.ln2 ? change.ln2 : change.ln} ${change.content}\n`
				})
				changes += "=".repeat(50) + "\n"
			})
			const tools = [
				codeComment({
					octokit,
					owner,
					repo: repoName.split('/')[1],
					pullNumber,
					commitId: head,
					path: file.from
				}), 
				codebaseSearch({customerId, repoName})
			]

			const executor = await initializeAgentExecutorWithOptions(tools, model, {
				agentType: 'openai-functions',
				returnIntermediateSteps: isDev,
				handleParsingErrors: true,
				verbose: false,
				agentArgs: {
					prefix
				}
			})

			await executor.call({input: changes})
		})
		return
	}
}
