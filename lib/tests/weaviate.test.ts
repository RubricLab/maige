import {expect, test} from 'bun:test'
import Weaviate from '~/utils/embeddings/db'

test.skip('Bun test runner - Weaviate', () => {
	// This is arbitrary. Could just return true.

	expect(Bun.version).toInclude('1.0')
})

// If Bun is unable to access env vars, pass these to the test runner:
// WEAVIATE_HOST, WEAVIATE_SCHEME, OPENAI_API_KEY
test(
	'Embed repo',
	async () => {
		const customerId = 'clot5gx6a0000uvdovvfi1x9q'
		const repoUrl = 'https://github.com/RubricLab/maige'
		const branch = 'staging'
		const query = 'codeSearch' // arbitrary - should change over time

		const vectorDB = new Weaviate(customerId)
		const docs = await vectorDB.embedRepo(repoUrl, branch)

		expect(docs?.length).toBeGreaterThan(0)

		const search = await vectorDB.searchCode(query, repoUrl, 1, undefined, branch)

		expect(search?.length).toBeGreaterThan(0)

		if (search?.length > 0) expect(search[0].text).toInclude('search')
	},
	15 * 1000
)
