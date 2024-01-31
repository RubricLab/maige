import {DynamicStructuredTool} from '@langchain/core/tools'
import {z} from 'zod'

/**
 * Call the GitHub REST API
 */
export function githubTool({octokit}: {octokit: any}) {
	return new DynamicStructuredTool({
		description: 'GitHub REST API',
		func: async ({path, body, method}) => {
			const apiUrl = 'https://api.github.com'

			try {
				const res = await octokit.request(`${apiUrl}${path}`, {
					method,
					headers: {
						accept: 'application/vnd.github+json',
						'user-agent': 'octokit-request'
					},
					...body
				})

				return res.data
					? // TODO: find a better way to ignore most of the GitHub API response
						JSON.stringify(res.data).replaceAll(apiUrl, '').slice(0, 1000)
					: 'Something went wrong. Read the docs.'
			} catch (error: any) {
				return `Something went wrong: ${error.message || 'unknown error'}`
			}
		},
		name: 'githubAPI',
		schema: z.object({
			path: z
				.string()
				.describe(
					'Path to the resource on the GitHub API eg. /repos/octokit/request/labels'
				),
			body: z
				.any()
				.describe('Variables to pass to request, as an object of keys with values'),
			method: z.string().describe('Request method, usually GET or POST')
		})
	})
}
