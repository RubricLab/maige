import Sandbox from '@e2b/sdk'
import {DynamicStructuredTool} from '@langchain/core/tools'
import {z} from 'zod'

export default function listFiles({shell, dir}: {shell: Sandbox; dir: string}) {
	return new DynamicStructuredTool({
		description: '',
		func: async ({path}) => {
			const files = await shell.filesystem.list(`${dir}/${path}`)

			const fileList = files
				.map(file => (file.isDir ? `${file.name}/` : file.name))
				.join('\n')

			console.log(`ls ${path}:\n\n`, fileList)

			return fileList
		},
		name: 'listFiles',
		schema: z.object({
			path: z.string().describe('The path to list files in')
		})
	})
}
