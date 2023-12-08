import {OpenAIEmbeddings} from 'langchain/embeddings/openai'
import {type WeaviateConfig} from './db'

const keys = [
	'source',
	'text',
	'ext',
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
	filePath?: string
) {
	const query = await weaviateConfig.client.graphql
		.get()
		.withClassName(weaviateConfig.indexName)
		.withFields(`${keys.join(' ')} _additional { score }`)
		.withWhere({
			operator: 'And',
			operands: [
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
				...(filePath
					? [
							{
								path: ['source'],
								operator: 'Equal' as 'Equal',
								valueText: filePath
							}
					  ]
					: [])
			]
		})
		.withNearVector({
			vector: await new OpenAIEmbeddings({
				openAIApiKey: process.env.OPENAI_API_KEY
			}).embedQuery(question)
		})
		.withLimit(maxResults)
		.do()

	return query.data.Get[weaviateConfig.indexName]
}
