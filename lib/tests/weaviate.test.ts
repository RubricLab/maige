import {expect, test} from 'bun:test'
import Weaviate from '~/utils/embeddings/db'

test(
	'Embed repo',
	async () => {
		const customerId = 'ai4vo'
		const repoFullName = 'RubricLab/maige'
		const branch = 'main'
		const query = 'code search' // arbitrary - should change over time

		const vectorDB = new Weaviate(customerId, 'CodeSearch')
		const docs = await vectorDB.embedRepo(repoFullName, branch, true)

		expect(docs?.length).toBeGreaterThan(0)

		const search = await vectorDB.searchCode(
			query,
			repoFullName,
			1,
			undefined,
			branch
		)

		console.log(search)

		expect(search?.length).toBeGreaterThan(0)

		if (search?.length > 0) expect(search[0].text).toInclude('search')
	},
	300 * 1000 // the max timeout of an edge function
)
