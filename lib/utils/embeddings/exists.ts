import {type WeaviateClient} from './db'

export async function checkIndexExists(
	client: WeaviateClient,
	indexName: string
) {
	const exists = await client.schema.exists(indexName)
	if (!exists)
		console.warn(
			'WARNING: Index does not exist. An index will be automatically created when you add documents.'
		)
}

export async function checkRepoExists(
	client: WeaviateClient,
	indexName: string,
	userid: string,
	repoUrl: string
) {
	const exists = await client.graphql
		.get()
		.withClassName(indexName)
		.withFields('repository')
		.withWhere({
			operator: 'And',
			operands: [
				{
					path: ['userId'],
					operator: 'Equal',
					valueText: userid
				},
				{
					path: ['repository'],
					operator: 'Equal',
					valueString: repoUrl
				}
			]
		})
		.withLimit(1)
		.do()

	return exists.data.Get[indexName].length > 0
}
