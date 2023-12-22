'use server'

import prisma from '~/prisma'

export async function updateInstruction(
	instructionId: string,
	instructionContent: string
) {
	try {
		await prisma.instruction.update({
			where: {id: instructionId},
			data: {
				content: instructionContent
			}
		})
		return true
	} catch (e) {
		console.log(e)
		return false
	}
}
