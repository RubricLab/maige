import {DynamicStructuredTool} from '@langchain/core/tools'
import {z} from 'zod'
import {engineer} from '~/agents/engineer'
import {addComment} from '~/utils/github'

/**
 * Dispatch an engineer agent
 */
export default function dispatchEngineer({
	octokit,
	issueId,
	repoFullName,
	issueNumber,
	customerId,
	projectId
}: {
	octokit: any
	issueId: string
	repoFullName: string
	issueNumber: number
	customerId: string
	projectId: string
}) {
	return new DynamicStructuredTool({
		description:
			'Dispatch an engineer to work on an issue. Default to this when asked to solve an issue.',
		func: async ({task, title}) => {
			console.log(issueId)
			const commentId = await addComment({
				octokit,
				issueId,
				comment: `**Engineer Dispatched.** See details on the [maige dashboard](https://maige.app).
| **Name** | **Status** | **Message** | **Updated (UTC)** |
|:---------|:-----------|:------------|:------------------|
| **${title}** | 🟡 Pending ([inspect](https://maige.app)) | | ${new Intl.DateTimeFormat('en-US', {month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true}).format(new Date())} |

Terminal output:

\`\`\` ls . \`\`\`
`
			})

			engineer({
				task,
				repoFullName,
				issueNumber,
				customerId,
				projectId,
				commentId,
				title
			})

			return 'dispatched'
		},
		name: 'dispatchEngineer',
		schema: z.object({
			task: z
				.string()
				.describe(
					"Specific, detailed instructions for the engineer. Don't include the repo name, issue number, etc. Only a very direct instruction."
				),
			title: z.string().describe('Simple few-word title for the task')
		})
	})
}
