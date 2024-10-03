import type { Team } from '@prisma/client'
import TeamDetailsForm from '~/components/dashboard/Settings/TeamDetailsForm'
import prisma from '~/prisma'

export default async function General({ params }: { params: { slug: string } }) {
	const team = await prisma.team.findUnique({ where: { slug: params.slug } })
	return (
		<div className="flex flex-col gap-6 py-0.5">
			<h3>General</h3>
			<TeamDetailsForm team={team as Team} />
		</div>
	)
}
