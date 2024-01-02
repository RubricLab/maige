import {Project} from '@prisma/client'
import {DotsHorizontalIcon} from '@radix-ui/react-icons'
import Link from 'next/link'

export function Repositories({projects}: {projects: Project[]}) {
	return (
		<div className='repo-cont w-full gap-4'>
			{projects.map(project => (
				<>
					<Link
						className='flex cursor-pointer flex-col justify-between rounded-lg border-2 border-zinc-800 border-opacity-70 p-6 py-50 w-full'
						href={`/dashboard/${project.id}`}
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
							<DotsHorizontalIcon />
						</div>
						<div className='flex flex-col text-sm'>
							<span>Merge pull request #2 from arihanv/Dev Merge Dev [example lol]</span>
							<span className='text-zinc-500'>66d ago</span>
						</div>
					</Link>
				</>
			))}
		</div>
	)
}
