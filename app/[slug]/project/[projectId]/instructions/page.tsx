import {Suspense} from 'react'
import {Instructions} from '~/components/dashboard/Instructions/Instructions'
import {PanelSkeletons} from '~/components/dashboard/Loader'
import prisma from '~/prisma'

export default async function Page({
	params
}: {
	params: {projectId: string; slug: string}
}) {
	return (
		<Suspense fallback={<PanelSkeletons amount={3} />}>
			<div className='flex w-full flex-col gap-4'>
				<h3>Instructions</h3>
				<InstructionsWrapper
					teamSlug={params.slug}
					projectId={params.projectId}
				/>
			</div>
		</Suspense>
	)
}

async function InstructionsWrapper({
	projectId,
	teamSlug
}: {
	projectId: string
	teamSlug: string
}) {
	const instructions = await prisma.instruction.findMany({
		where: {
			projectId: projectId
		}
	})
	return (
		<Instructions
			teamSlug={teamSlug}
			projectId={projectId}
			instructions={instructions}
		/>
	)
}
