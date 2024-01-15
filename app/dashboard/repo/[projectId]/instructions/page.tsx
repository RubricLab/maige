import {PanelSkeletons} from 'app/dashboard/Loader'
import {Suspense} from 'react'
import {Instructions} from '~/components/dashboard/Instructions'
import prisma from '~/prisma'

export default async function Page({params}: {params: {projectId: string}}) {
	return (
		<Suspense fallback={<PanelSkeletons amount={3} />}>
			<div className='flex w-full flex-col items-center gap-8'>
				<div className='text-2xl font-medium'>Custom Instructions</div>
				<InstructionsWrapper projectId={params.projectId} />
			</div>
		</Suspense>
	)
}

async function InstructionsWrapper({projectId}: {projectId: string}) {
	const instructions = await prisma.instruction.findMany({
		where: {
			projectId: projectId
		}
	})

	return <Instructions projectId={projectId} instructions={instructions} />
}
