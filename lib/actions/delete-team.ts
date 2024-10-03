'use server'
import { z } from 'zod'
import prisma from '~/prisma'
import { getCurrentUser } from '~/utils/session'

const schema = z.object({
	name: z.string(),
	slug: z.string()
})

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export default async function deleteTeam(_prevState: any, formData: FormData) {
	const user = await getCurrentUser()
	if (!user)
		return {
			message: 'Unauthorized, no session',
			type: 'error'
		}

	const parsed = schema.parse({
		name: formData.get('name'),
		slug: formData.get('slug')
	})

	try {
		await prisma.team.delete({ where: { slug: parsed.slug } })
		return {
			message: `Successfully deleted ${parsed.name}`,
			type: 'success'
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
