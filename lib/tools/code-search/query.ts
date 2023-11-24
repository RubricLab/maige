import {OpenAIEmbeddings} from 'langchain/embeddings/openai'
import {type WeaviateConfig} from './weaviate-client'

export default async function search(
	weaviateConfig: WeaviateConfig,
	question: string,
	k: number,
	repository: string
) {
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

	const data = await weaviateConfig.client.graphql
		.get()
		.withClassName(weaviateConfig.indexName)
		.withFields(`${keys.join(' ')} _additional { score }`)
		.withWhere({
			operator: 'And',
			operands: [
				{
					path: ['userId'],
					operator: 'Equal',
					valueText: weaviateConfig.userId
				},
				{
					path: ['repository'],
					operator: 'Equal',
					valueString: repository
				}
			]
		})
		.withNearVector({
			vector: await new OpenAIEmbeddings({
				openAIApiKey: process.env.OPENAI_API_KEY
			}).embedQuery(question)
		})
		.withLimit(k)
		.do()

	return data.data.Get[weaviateConfig.indexName]
}
