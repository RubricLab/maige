import Sandbox from '@e2b/sdk'
import {DynamicStructuredTool} from 'langchain/tools'
import {z} from 'zod'

export default function readFile({shell, dir}: {shell: Sandbox; dir: string}) {
	return new DynamicStructuredTool({
		description: '',
		func: async ({path}) => {
			return await shell.filesystem.read(`${dir}/${path}`)
		},
		name: 'readFile',
		schema: z.object({
			path: z.string().describe('The path to read the file from')
		})
	})
}
