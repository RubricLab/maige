import {expect, test} from 'bun:test'
import Weaviate from '~/utils/embeddings/db'

test(
	'Embed repo',
	async () => {
		const customerId = 'clot5gx6a0000uvdovvfi1x9q'
		const repoUrl = 'https://github.com/RubricLab/maige'
		const branch = 'main'
		const query = 'search code' // arbitrary - should change over time

		const vectorDB = new Weaviate(customerId, 'CodeSearch_Test')
		const docs = await vectorDB.embedRepo(repoUrl, branch)

		expect(docs?.length).toBeGreaterThan(0)

		const search = await vectorDB.searchCode(query, repoUrl, 1, undefined, branch)

		expect(search?.length).toBeGreaterThan(0)

		if (search?.length > 0) expect(search[0].text).toInclude('search')
	},
	300 * 1000 // the max timeout of an edge function
)
