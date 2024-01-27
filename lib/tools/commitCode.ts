import Sandbox from '@e2b/sdk'
import {DynamicStructuredTool} from '@langchain/core/tools'
import {z} from 'zod'
import env from '~/env.mjs'

export default function commitCode({
	shell,
	dir
}: {
	shell: Sandbox
	dir: string
}) {
	return new DynamicStructuredTool({
		description: '',
		func: async ({message, files}) => {
			const botUserName = `${env.GITHUB_APP_NAME}[bot]` // Replace with your GitHub App's bot user name
			const botUserEmail = `${env.GITHUB_APP_ID}+${env.GITHUB_APP_NAME}[bot]@users.noreply.github.com` // Replace with your GitHub App's bot user email

			await shell.process.startAndWait({
				cmd: `cd ${dir} && git config user.name "${botUserName}" && git config user.email "${botUserEmail}" && git add ${files.join(
					' '
				)} && git commit -m "${message}"`
			})

			return 'committed'
		},
		name: 'commitCode',
		schema: z.object({
			message: z.string().describe('The commit message'),
			files: z
				.array(z.string())
				.describe(
					'The files to add and commit as paths relative to the root of the repo'
				)
		})
	})
}
