import Link from 'next/link'

export function Repositories({projects}: {projects: any[]}) {
	return (
		<div className='repo-cont w-full'>
			{projects.map(project => (
				<>
					<Link
						className='flex h-[150px] w-full cursor-pointer flex-col justify-between rounded-lg border-2 border-zinc-800 border-opacity-70 bg-black bg-opacity-20 p-5 py-4 hover:bg-zinc-800 hover:bg-opacity-70 hover:transition-all'
						href={`/dashboard/repo/${project.id}`}
						key={project.id}>
						<div className='flex w-full items-center justify-between'>
							<div className='flex items-center gap-3'>
								<div className='relative'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='25'
										height='25'
										viewBox='0 0 59 59'
										fill='#fff'>
										<circle
											cx='29.5'
											cy='29.5'
											r='29.5'
											fill='white'
										/>
									</svg>
									<p className='absolute left-0 right-0 top-1/2 m-auto -translate-y-1/2 text-center text-sm leading-none text-black'>
										{project.name.charAt(0).toUpperCase()}
									</p>
								</div>
								<p className='text-lg'>{project.name}</p>
							</div>
							{/* <RepositoryOptions projectId={project.id}/> */}
						</div>
						<div className='flex flex-col'>
							<span className='text-base font-semibold'>
								{project.customInstructions.length} Custom Instructions
							</span>
							<span className='text-sm text-zinc-500'>
								{(() => {
									const date = new Date(project.createdAt)
									const daysAgo = Math.floor(
										(new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
									)
									return daysAgo === 0
										? 'today'
										: `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`
								})()}
							</span>
						</div>
					</Link>
				</>
			))}
		</div>
	)
}
