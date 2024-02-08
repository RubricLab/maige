'use client'

import {useRouter} from 'next/navigation'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select'

type Project = {
	id: string
	name: string
}

type Props = {
	teamSlug: string
	projects: Project[]
	proj: string | undefined
}

export default function ProjectFilter({proj, projects, teamSlug}: Props) {
	const router = useRouter()

	const handleProjectChange = (value: string) => {
		if (value === 'all') return router.replace(`/${teamSlug}/usage`)
		return router.replace(`/${teamSlug}/usage?proj=${value}`)
	}

	return (
		<Select
			defaultValue={proj || 'all'}
			onValueChange={value => handleProjectChange(value)}>
			<SelectTrigger className='w-[180px]'>
				<SelectValue placeholder='Select a fruit' />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectItem
						className='hover:cursor-pointer'
						value='all'>
						All Projects
					</SelectItem>
					{projects.map(project => (
						<SelectItem
							className='hover:cursor-pointer'
							key={project.id}
							value={project.id}>
							{project.name}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
