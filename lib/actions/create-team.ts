'use server'
import { z } from 'zod'
import prisma from '~/prisma'
import { slugify } from '~/utils'
import { getCurrentUser } from '~/utils/session'

const schema = z.object({
	name: z.string()
})

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export default async function createTeam(_prevState: any, formData: FormData) {
	const user = await getCurrentUser()
	if (!user)
		return {
			message: 'Unauthorized, no session',
			type: 'error'
		}

	const parsed = schema.parse({
		name: formData.get('name')
	})

	try {
		const response = await prisma.team.create({
			data: {
				name: parsed.name,
				slug: slugify(parsed.name),
				createdBy: user.id,
				memberships: {
					create: { userId: user.id, role: 'ADMIN' }
				}
			}
		})
		return {
			message: `Successfully created ${parsed.name}`,
			type: 'success',
			data: { slug: response.slug }
		}
	} catch (err) {
		if (err instanceof Error)
			return {
				message: err.message,
				type: 'error'
			}
		return {
			message: JSON.stringify(err),
			type: 'error'
		}
	}
}
