import weaviate from 'weaviate-ts-client'
import {schema} from './schema'

export async function main() {
	console.log('Grabbing Weaviate schema template...')

	console.log('Creating Weaviate schema...')

	const client = weaviate.client({
		scheme: 'https',
		host: process.env.WEAVIATE_HOST
	})

	try {
		await client.schema.classCreator().withClass(schema).do()
		console.log('Schema created!')
	} catch (e: unknown) {
		console.log(e instanceof Error && e.message)
	}
}

main()
