import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'
import Weaviate from '~/utils/embeddings/db'

/**
 * Search codebase
 */
export function codebaseSearch({
	customerId,
	repoFullName
}: {
	customerId: string
	repoFullName: string
}) {
	return new DynamicStructuredTool({
		description:
			'Search the codebase by query. Uses vector similarity; format queries to make use of this.',
		func: async ({ query, filePath }) => {
			const db = new Weaviate(customerId)
			const docs = await db.searchCode(query, repoFullName, 3, filePath)

			if (!docs?.length) return 'No results found'

			// TODO: format this optimally for GPT
			const codeString = docs
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				.map(({ source, text }: any) => JSON.stringify({ source, text }))
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
