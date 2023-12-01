import Sandbox from '@e2b/sdk'
import {DynamicStructuredTool} from 'langchain/tools'
import {z} from 'zod'

export default function listFiles({shell, dir}: {shell: Sandbox; dir: string}) {
	return new DynamicStructuredTool({
		description: '',
		func: async ({path}) => {
			const files = await shell.filesystem.list(`${dir}/${path}`)
			console.log('LISTING FILES: ', files)
			return files
				.map(file => (file.isDir ? `dir: ${file.name}` : file.name))
				.join('\n')
		},
		name: 'listFiles',
		schema: z.object({
			path: z.string().describe('The path to list files in')
		})
	})
}
