import {Suspense} from 'react'
import {Instructions} from '~/components/dashboard/Instructions/Instructions'
import {PanelSkeletons} from '~/components/dashboard/Loader'

export default async function Page({
	params
}: {
	params: {projectId: string; slug: string}
}) {
	return (
		<Suspense fallback={<PanelSkeletons amount={3} />}>
			<div className='flex w-full flex-col gap-4'>
				<h3>Instructions</h3>
				<Instructions projectId={params.projectId} />
			</div>
		</Suspense>
	)
}
