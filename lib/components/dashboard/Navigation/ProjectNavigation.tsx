'use client'

import Link from 'next/link'
import {useParams, usePathname, useRouter} from 'next/navigation'
import {SecondaryButton} from '../Buttons'
import {LargeHeading, MediumBody} from '../Text'

export function ProjectNavigation({projectName}: {projectName: string}) {
	const {projectId} = useParams()
	const router = useRouter()
	const pathname = usePathname()

	return (
		<div className='flex flex-col gap-10 pb-10'>
			<div className='flex flex-row items-center gap-6'>
				<SecondaryButton onClick={() => router.push('/dashboard')}>
					← All Repos
				</SecondaryButton>
				<LargeHeading>{projectName}</LargeHeading>
			</div>
			<div className='flex flex-row items-center gap-8'>
				<MediumBody>
					<Link
						href={`/dashboard/${projectId}/instructions`}
						className={
							pathname === `/dashboard/${projectId}/instructions`
								? 'border-b-2 border-solid border-white'
								: ''
						}>
						Instructions
					</Link>
				</MediumBody>
				<MediumBody>
					<Link
						href={`/dashboard/${projectId}/runs`}
						className={
							pathname === `/dashboard/${projectId}/runs`
								? 'border-b-2 border-solid border-white'
								: ''
						}>
						Runs
					</Link>
				</MediumBody>
				<MediumBody>
					<Link
						href={`/dashboard/${projectId}/settings`}
						className={
							pathname === `/dashboard/${projectId}/settings`
								? 'border-b-2 border-solid border-white'
								: ''
						}>
						Settings
					</Link>
				</MediumBody>
			</div>
		</div>
	)
}
