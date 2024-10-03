'use server'

import prisma from '~/prisma'
import { getCurrentUser } from '~/utils/session'

// Delete an instruction
export default async function deleteInstruction(instructionId: string) {
	const user = await getCurrentUser()
	if (!user)
		return {
			message: 'Unauthorized, no session',
			type: 'error'
		}

	// Check for the following scenarios
	// 1. instruction exists
	// 2. user triggering delete has some relationship to the team containing the instruction
	const instruction = await prisma.instruction.findFirst({
		where: {
			id: instructionId,
			project: { team: { memberships: { some: { userId: user.id } } } }
		}
	})
	if (!instruction)
		return {
			message: 'Instruction not found',
			type: 'error'
		}

	try {
		await prisma.instruction.delete({
			where: {
				id: instruction.id
			}
		})
		return {
			message: 'Instruction deleted',
			type: 'success'
		}
	} catch (err) {
		if (err instanceof Error)
			return {
				message: err.message,
				type: 'error'
			}
		return {
			message: `Unexpected error: ${JSON.stringify(err)}`,
			type: 'error'
		}
	}
}
