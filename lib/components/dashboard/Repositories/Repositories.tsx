import {PlusIcon} from 'lucide-react'
import Link from 'next/link'
import {ReactNode} from 'react'
import env from '~/env.mjs'
import {cn, timeAgo} from '~/utils'

function RepoLayout({
	children,
	href,
	className
}: {
	children: ReactNode
	href: string
	className?: string
}) {
	return (
		<Link
			className={cn(
				className,
				'border-tertiary hover:border-secondary relative flex h-36 w-full cursor-pointer flex-col justify-between rounded-lg border p-4 py-3.5 transition-opacity duration-300'
			)}
			href={href}>
			{children}
		</Link>
	)
}

function AddRepository() {
	return (
		<RepoLayout
			className='!border-dashed'
			href={`https://github.com/apps/${env.GITHUB_APP_NAME}/installations/new`}>
			<div className='flex h-full w-full items-center justify-center gap-2'>
				<PlusIcon />
				Add repository
			</div>
		</RepoLayout>
	)
}

export function Repositories({projects}: {projects: any[]}) {
	return (
		<div className='grid w-full gap-4 sm:grid-cols-4'>
			{projects.map(project => (
				<RepoLayout
					href={`/dashboard/repo/${project.id}`}
					key={project.id}>
					<div className='flex w-full items-center justify-between'>
						<div className='flex items-center gap-3'>
							<div className='relative'>
								<div className='h-6 w-6 rounded-full bg-foreground' />
								<p className='text-secondary absolute left-0 right-0 top-1/2 m-auto -translate-y-1/2 text-center font-medium leading-none'>
									{project.name.charAt(0).toUpperCase()}
								</p>
							</div>
							<p className='text-lg'>{project.name}</p>
						</div>
					</div>
					<div className='flex flex-col gap-1'>
						<span className='font-medium'>
							{project.customInstructions.length} Custom Instructions
						</span>
						<span className='text-sm text-gray-500'>
							Added {timeAgo(project.createdAt)}
						</span>
					</div>
				</RepoLayout>
			))}
			<AddRepository />
		</div>
	)
}
