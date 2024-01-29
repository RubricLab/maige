import {Prisma} from '@prisma/client'

export type ProjectWithInstructions = Prisma.ProjectGetPayload<{
	include: {instructions: true}
}>
