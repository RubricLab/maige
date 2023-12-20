import prisma from '../prisma'

/**
 * Log an AI response to the DB
 */
export async function logRun({
	repoFullName,
	customerId,
	output
}: {
	repoFullName: string
	customerId: string
	output: string
}) {
	try {
		const name = repoFullName.split('/')[1]

		const res = await prisma.project.update({
			where: {
				customerId_name: {
					customerId,
					name
				}
			},
			data: {
				runs: {
					create: {
						output
					}
				}
			},
			select: {
				id: true
			}
		})

		return res
	} catch (e) {
		console.error(e)
	}
}
