import {redirect} from 'next/navigation'
import prisma from '~/prisma'
import {getCurrentUser} from '~/utils/session'
import {Homepage} from './home/page'

const Page = async () => {
	const user = await getCurrentUser()

	if (user) {
		// Check if a team already exists
		const existingTeam = await prisma.membership.findFirst({
			where: {userId: user.id},
			include: {
				team: true
			}
		})
		if (existingTeam) redirect(`/${existingTeam.team.slug}`)

		// If no team, create a playground team
		const userData = await prisma.user.findFirst({
			where: {id: user.id},
			select: {
				userName: true,
				projects: {where: {teamId: '1'}, select: {id: true}}
			}
		})

		const newTeam = await prisma.team.create({
			data: {
				createdBy: user.id,
				slug: userData.userName,
				name: user.name,
				memberships: {create: [{userId: user.id, role: 'ADMIN'}]},

				// onboarding flow for legacy accounts
				...(userData.projects && {
					Project: {connect: userData.projects.map(({id}) => ({id}))}
				})
			}
		})
		if (newTeam) redirect(`/${newTeam.slug}`)
	}

	return <Homepage />
}

export default Page
