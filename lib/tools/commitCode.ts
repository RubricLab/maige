import Sandbox from '@e2b/sdk'
import {DynamicStructuredTool} from 'langchain/tools'
import {z} from 'zod'

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
			await shell.process.startAndWait({
				cmd: `cd ${dir} && git add ${files.join(' ')} && git commit -m "${message}"`
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
