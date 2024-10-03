import type { Sandbox } from '@e2b/sdk'
import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'
/**
 * Execute a shell command
 */
export default function exec({
	shell,
	setupCmd = '',
	preCmdCallback = cmd => cmd,
	name,
	description
}: {
	shell: Sandbox
	setupCmd?: string
	preCmdCallback?: (cmd: string) => string
	name: string
	description: string
}) {
	return new DynamicStructuredTool({
		description,
		func: async ({ cmd }) => {
			if (setupCmd)
				await shell.process.startAndWait({
					cmd: setupCmd
				})

			const modifiedCmd = preCmdCallback(cmd)

			const proc = await shell.process.start({ cmd: modifiedCmd })

			await proc.wait()

			return JSON.stringify(proc.output)
		},
		name,
		schema: z.object({
			cmd: z.string().describe('The shell command to execute')
		})
	})
}
