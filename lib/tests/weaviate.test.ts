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
		const customerId = '2ceed'
		const repoUrl = 'https://github.com/RubricLab/maige'
		const branch = 'staging'
		const query = 'codeSearch'

		const vectorDB = new Weaviate(customerId)
		const docs = await vectorDB.embedRepo(repoUrl, branch)

		expect(docs.length).toBeGreaterThan(0)

		const search = await vectorDB.searchCode(query, repoUrl, 1, undefined, branch)

		expect(search.length).toBeGreaterThan(0)

		if (search.length > 0) expect(search[0].text).toInclude('search')
	},
	15 * 1000
)
