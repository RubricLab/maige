import {DynamicStructuredTool} from 'langchain/tools'
import {z} from 'zod'
import Weaviate from '~/utils/embeddings/db'

/**
 * Search codebase
 */
export function codebaseSearch({
	customerId,
	repoFullName,
	filePath
}: {
	customerId: string
	repoFullName: string
	filePath?: string
}) {
	return new DynamicStructuredTool({
		description:
			'Search the codebase by query. Uses vector similarity; format queries to make use of this.',
		func: async ({query}) => {
			const db = new Weaviate(customerId)
			const docs = await db.searchCode(query, repoFullName, 3, filePath)

			if (!docs?.length) return 'No results found'

			// TODO: format this optimally for GPT
			const codeString = docs
				.map(({source, text}) => JSON.stringify({source, text}))
				.join('\n\n')

			return codeString
		},
		name: 'searchCode',
		schema: z.object({
			query: z.string().describe('The query to search'),
			filePath: z.string().optional().describe('The file path to search')
		})
	})
}
