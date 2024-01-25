import {Suspense} from 'react'
import {PanelSkeletons} from '~/components/dashboard/Loader'

export default async function Page({params}: {params: {projectId: string}}) {
	return (
		<Suspense fallback={<PanelSkeletons amount={3} />}>
			<div className='flex w-full flex-col gap-8'>
				<h2>Labeler</h2>
				<h2>Engineer</h2>
				<h2>Reviewer</h2>
				<h2>Custom</h2>
				<h3>[PREFIX] [TOOLS]</h3>
			</div>
		</Suspense>
	)
}
