'use client'

import {Project} from '@prisma/client'
import {motion} from 'framer-motion'
import {useRouter} from 'next/navigation'

export function Repositories({projects}: {projects: Project[]}) {
	const router = useRouter()
	return (
		<div className='flex flex-wrap items-center gap-4'>
			{projects.map(project => (
				<motion.div
					whileHover={{
						scale: 1.05,
						transition: {
							duration: 0.5
						}
					}}
					className='bg-panel border-panel-border flex cursor-pointer flex-row items-center gap-4  rounded-md border-2 p-8'
					onClick={() => router.push(`/dashboard/${project.id}`)}
					key={project.id}>
					<div className='relative'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='59'
							height='59'
							viewBox='0 0 59 59'
							fill='#fff'>
							<circle
								cx='29.5'
								cy='29.5'
								r='29.5'
								fill='white'
							/>
						</svg>
						<p className='absolute left-0 right-0 top-1/2 m-auto -translate-y-1/2 text-center text-[32px] leading-none text-black'>
							{project.name.charAt(0).toUpperCase()}
						</p>
					</div>
					<p className='text-[32px]'>{project.name}</p>
				</motion.div>
			))}
		</div>
	)
}
