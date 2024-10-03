import type { WeaviateConfig } from './db'

export default async function deleteFiles(
	weaviateConfig: WeaviateConfig,
	repository: string,
	filePaths: string[],
	branch: string
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
				},
				{
					path: ['branch'],
					operator: 'Equal',
					valueText: branch
				},
				{
					path: ['source'],
					operator: 'ContainsAny',
					valueTextArray: filePaths
				}
			]
		})
		.do()

	return res.results
}
