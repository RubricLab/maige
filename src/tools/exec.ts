import Session from '@e2b/sdk'
import {DynamicStructuredTool} from 'langchain/tools'
import {z} from 'zod'

const maxDuration = 2 // 1 minutes

export default function exec({
	shell,
	setupCmd = '',
	preCmdCallback = cmd => cmd,
	name,
	description
}: {
	shell: Session
	setupCmd?: string
	preCmdCallback?: (cmd: string) => string
	name: string
	description: string
}) {
	return new DynamicStructuredTool({
		description,
		func: async ({cmd}) => {
			// const shell = await Session.create({
			//   apiKey: env.E2B_API_KEY,
			//   id: "Nodejs",
			//   onStderr: (data) => {console.error(data.line); stderr += data.line},
			//   onStdout: (data) => {console.log(data.line); stdout += data.line},
			// });

			if (setupCmd) {
				const setup = await shell.process.start({
					cmd: setupCmd
				})

				await setup.wait()
			}

			const modifiedCmd = preCmdCallback(cmd)

			const proc = await shell.process.start({cmd: modifiedCmd})

			// start timeout
			setTimeout(
				() => {
					proc.kill()
					return JSON.stringify({
						output: `Error: Command timed out after ${maxDuration} minutes.`
					})
				},
				1000 * 60 * maxDuration
			)

			await proc.wait()

			return JSON.stringify({
				output: proc.output
			})
		},
		name,
		schema: z.object({
			cmd: z.string().describe('The shell command to execute')
		})
	})
}
