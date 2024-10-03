import prisma from '~/prisma'
import ProjectFilter from './projectFilter'

type Props = {
	teamId: string
	teamSlug: string
	proj: string | undefined
}

export default async function ProjectFilterWrapper({ teamId, teamSlug, proj }: Props) {
	const projects = await prisma.project.findMany({
		where: {
			teamId: teamId
		},
		select: {
			id: true,
			name: true
		}
	})
	return (
		<ProjectFilter
			proj={proj}
			teamSlug={teamSlug}
			projects={projects as { id: string; name: string }[]}
		/>
	)
}
