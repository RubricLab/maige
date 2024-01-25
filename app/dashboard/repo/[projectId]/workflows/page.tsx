import {Suspense} from 'react'
import {PanelSkeletons} from '~/components/dashboard/Loader'
import {Instructions} from '~/components/dashboard/Workflows'
import prisma from '~/prisma'

export default async function Page({params}: {params: {projectId: string}}) {
	return (
		<Suspense fallback={<PanelSkeletons amount={3} />}>
			<div className='flex w-full flex-col gap-8'>
				<h3>When [WEBHOOK] happens, if [CONDITION], dispatch [BOT]</h3>
				<div className='text-2xl font-medium'>Workflows</div>
				<h2>Issues</h2>
				<InstructionsWrapper projectId={params.projectId} />
				<h2>Pull Requests</h2>
				<h2>Chat</h2>

				<h3>When [AN ISSUE IS OPENED], dispatch [LABELER]</h3>
				<h3>When [AN ISSUE IS OPENED], dispatch [ASSIGNER]</h3>
				<h3>
					When [AN ISSUE IS OPENED], if [INCLUDES AUTO IN TITLE], dispatch [ENGINEER]
				</h3>
			</div>
		</Suspense>
	)
}

async function InstructionsWrapper({projectId}: {projectId: string}) {
	const instructions = await prisma.instruction.findMany({
		where: {
			projectId
		}
	})

	return (
		<Instructions
			projectId={projectId}
			instructions={instructions}
		/>
	)
}
