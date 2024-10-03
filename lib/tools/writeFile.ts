import type Sandbox from '@e2b/sdk'
import { DynamicStructuredTool } from '@langchain/core/tools'
import path from 'node:path'
import { z } from 'zod'

export default function writeFile({ shell, dir }: { shell: Sandbox; dir: string }) {
	return new DynamicStructuredTool({
		description: '',
		func: async ({ code, fileName }) => {
			const directory = path.dirname(`${dir}/${fileName}`)

			await shell.filesystem.makeDir(directory)
			await shell.filesystem.write(`${dir}/${fileName}`, code)

			return 'wrote file'
		},
		name: 'writeFile',
		schema: z.object({
			code: z.string().describe('The code to write to the file'),
			fileName: z.string().describe('The path to write the file to')
		})
	})
}
