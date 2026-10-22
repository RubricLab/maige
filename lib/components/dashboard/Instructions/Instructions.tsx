import { notFound } from 'next/navigation'
import prisma from '~/prisma'
import { getCurrentUser } from '~/utils/session'
import CreateInstruction from './CreateInstruction'
import InstructionCard from './InstructionCard'

export async function Instructions({
	projectId,
	teamSlug
}: { projectId: string; teamSlug: string }) {
	const user = await getCurrentUser()
	if (!user) return notFound()

	const project = await prisma.project.findFirst({
		where: {
			id: projectId,
			team: { slug: teamSlug, memberships: { some: { userId: user.id } } }
		},
		include: { instructions: true }
	})
	if (!project) return notFound()
	const { instructions } = project
	return (
		<div className="grid grid-cols-3 gap-4">
			<CreateInstruction projectId={projectId} />
			{instructions.map(instruction => (
				<InstructionCard instruction={instruction} key={instruction.id} />
			))}
		</div>
	)
}
