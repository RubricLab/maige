import {PanelSkeletons} from 'app/dashboard/Loader'
import {Suspense} from 'react'
import {Instructions} from '~/components/dashboard/Instructions'

export default async function Page({params}: {params: {projectId: string}}) {
	return (
		<Suspense fallback={<PanelSkeletons amount={3} />}>
			<InstructionsWrapper projectId={params.projectId} />
		</Suspense>
	)
}

// Component that is a child of the suspense boundary needs to do the fetching. We cannot fetch the instructions on the top level Page component
// This is why we need this instructions wrapper that fetches the project's instructions
async function InstructionsWrapper({projectId}: {projectId: string}) {
	async function wait(ms) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}

	await wait(3000) // just to demo Suspense, can remove obviously

	const instructions = await prisma.instruction.findMany({
		where: {
			projectId: projectId
		}
	})

	return <Instructions instructions={instructions} />
}
