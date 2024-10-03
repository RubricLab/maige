import type { Project } from '@prisma/client'
import type { User } from 'next-auth'
import prisma from '~/prisma'
import DashboardNavClient from './DashboardNavClient'

export default async function DashboardNavServer({ user }: { user: User }) {
	// Get all teams that user has access to
	const teams = await prisma.membership
		.findMany({
			where: { userId: user.id },
			select: {
				team: {
					include: {
						Project: {
							select: {
								id: true,
								name: true
							}
						}
					}
				}
			}
		})
		.then(memberships => memberships.map(m => m.team))
	const projects = teams.flatMap(({ Project }) => Project)

	return <DashboardNavClient user={user} teams={teams} projects={projects as Project[]} />
}
