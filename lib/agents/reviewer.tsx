import {initializeAgentExecutorWithOptions} from 'langchain/agents'
import {ChatOpenAI} from 'langchain/chat_models/openai'
import {SerpAPI} from 'langchain/tools'
import parse, {Change, Chunk, File} from 'parse-diff'
import env from '~/env.mjs'
import {codeComment} from '~/tools/codeComment'
import {prComment} from '~/tools/prComment'
import {isDev} from '~/utils'

const model = new ChatOpenAI({
	modelName: 'gpt-4-1106-preview',
	openAIApiKey: env.OPENAI_API_KEY,
	temperature: 0.3
})

export default async function reviewer({
	input,
	octokit,
	pullId,
	owner,
	repo,
	pull_number,
	head
}: {
	input: string
	octokit: any
	pullId?: string
	owner?: string
	repo?: string
	pull_number?: number
	head?: string
}) {
	if (pullId) {
		const tools = [new SerpAPI(), prComment({octokit, pullId})]

		const prefix = `
		YOU MUST LEAVE A COMMENT on the PR according to the user's instructions using the prComment function.
		You are senior engineer named Maige that is answering questions about a Pull Request on GitHub. Try to keep it somewhat short
		and don't add fluff to it. Keep the tone neutral and do not include any expressions of gratitude or personal names, Just give the answer.
		Format your answer in the comment using markdown suitable for GitHub.
		Don't ask to leave a comment, you must do it automatically.
		DO NOT use any emojis or non-Ascii characters.
		{agent_scratchpad}
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
	} else {
		const prefix = `
		You are reviewing code snippets from a pull request. Your goal is to provide feedback on the code snippet
		through using the codeComment function. You must specify the line number for the line you wish to comment on. If there is no reason
		to comment on a line then don't do anything.
		{agent_scratchpad}
		`.replaceAll('\n', ' ')

		let files = parse(input)

		files.forEach((file: File) => {
			file.chunks.forEach(async (chunk: Chunk) => {
				let changes = ''
				chunk.changes.forEach((change: Change & {ln2?: string; ln?: string}) => {
					changes += `${change.ln2 ? change.ln2 : change.ln} ${change.content}\n`
				})

				const tools = [
					codeComment({
						octokit,
						owner,
						repo,
						pull_number,
						commit_id: head,
						path: file.from
					})
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
		})
		return
	}
}
