import type { Prisma } from '@prisma/client'

export type ProjectWithInstructions = Prisma.ProjectGetPayload<{
	include: { instructions: true; organization: true }
}>
