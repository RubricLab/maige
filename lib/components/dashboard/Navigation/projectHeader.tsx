import {Project} from '@prisma/client'
import {useEffect, useState} from 'react'
import {Skeleton} from '~/components/ui/skeleton'
import {getProject} from './actions'

type Props = {
	projectId: string
}

export default function ProjectRoute({projectId}: Props) {
	const [project, setProject] = useState<Project>()
	useEffect(() => {
		async function setProj() {
			setProject(await getProject(projectId))
		}
		setProj()
	}, [projectId])
	return (
		<>{project ? <> {project.name}</> : <Skeleton className='h-5 w-28' />}</>
	)
}
