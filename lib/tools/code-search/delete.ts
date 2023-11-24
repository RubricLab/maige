import {type WeaviateConfig} from './weaviate-client'

export default async function deleteRepo(
	weaviateConfig: WeaviateConfig,
	repository: string
) {
	const res = await weaviateConfig.client.batch
		.objectsBatchDeleter()
		.withClassName(weaviateConfig.indexName)
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
		.do()

	return res.results
}
