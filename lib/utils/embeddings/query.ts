import {OpenAIEmbeddings} from '@langchain/openai'
import env from '~/env.mjs'
import {type WeaviateConfig} from './db'

const keys = [
	'source',
	'text',
	'ext',
	'summary',
	'repository',
	'branch',
	'userId',
	'loc_lines_from',
	'loc_lines_to'
]

export default async function search(
	weaviateConfig: WeaviateConfig,
	question: string,
	maxResults: number,
	repository: string,
	filePath?: string,
	branch?: string
) {
	const operands = [
		{
			path: ['userId'],
			operator: 'Equal' as 'Equal',
			valueText: weaviateConfig.userId
		},
		{
			path: ['repository'],
			operator: 'ContainsAny' as 'ContainsAny',
			valueStringArray: [repository]
		},
		...(filePath && [
			{
				path: ['source'],
				operator: 'Equal' as 'Equal',
				valueText: filePath
			}
		]),
		...(branch && [
			{
				path: ['branch'],
				operator: 'Equal' as 'Equal',
				valueText: branch
			}
		])
	]

	const query = await weaviateConfig.client.graphql
		.get()
		.withClassName(weaviateConfig.indexName)
		.withFields(`${keys.join(' ')} _additional { score }`)
		.withWhere({
			operator: 'And',
			operands
		})
		.withNearVector({
			vector: await new OpenAIEmbeddings({
				openAIApiKey: env.OPENAI_API_KEY,
				modelName: 'text-embedding-3-small'
			}).embedQuery(question)
		})
		.withLimit(maxResults)
		.do()

	return query.data.Get[weaviateConfig.indexName]
}
