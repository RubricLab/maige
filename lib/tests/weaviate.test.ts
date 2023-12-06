import {expect, test} from 'bun:test'
import Weaviate from '~/utils/embeddings/db'

test.skip('Bun test runner - Weaviate', () => {
	// This is arbitrary. Could just return true.

	expect(Bun.version).toInclude('1.0')
})

// To test this, pass the following env vars to the process:
// WEAVIATE_HOST, WEAVIATE_SCHEME, OPENAI_API_KEY
// since Bun seems to not be able to access env vars
test.skip(
	'Embed repo',
	async () => {
		const customerId = Math.random().toString(36).substring(7)
		const repoUrl = 'https://github.com/RubricLab/shot'
		const branch = 'main'

		const vectorDB = new Weaviate(customerId)

		const docs = await vectorDB.embedRepo(repoUrl, branch, true)

		console.log(`Loaded ${docs?.length} docs`)

		expect(docs.length).toBeGreaterThan(0)
	},
	15 * 1000
)
