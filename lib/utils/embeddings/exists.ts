import {type WeaviateClient} from './db'

export default async function checkIndexExists(
	client: WeaviateClient,
	indexName: string
) {
	const exists = await client.schema.exists(indexName)
	if (!exists)
		console.warn(
			'WARNING: Index does not exist. An index will be automatically created when you add documents.'
		)
}
