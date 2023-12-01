import {ChatOpenAI} from 'langchain/chat_models/openai'
import env from '~/env.mjs'
import commentTool from '~/tools/comment'

const model = new ChatOpenAI({
	modelName: 'gpt-4-1106-preview',
	openAIApiKey: env.OPENAI_API_KEY,
	temperature: 0
})

export default async function reviewer({
	input,
	octokit,
	pullId
}: {
	input: string
	octokit: any
	pullId: any
}) {
	console.log('Generating summary of PR')
	const message = await model.predict(
		'Summarize this Pull Request:\n\n ' + input
	)
	await commentTool({octokit}).func({issueId: pullId, comment: message})

	return message
}
