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
				<div className='gap-2'>
					<h3>Instructions</h3>
					<p className='text-tertiary text-base'>
						Write rules for what Maige should do when an issue, PR, or comment comes
						in.
					</p>
				</div>
				<Instructions projectId={params.projectId} />
			</div>
		</Suspense>
	)
}
