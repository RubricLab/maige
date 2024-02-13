/*
 * From Root: bun --env-file=.env.local lib/scripts/addLegacyRepoIds.ts
 */

import prisma from '~/prisma'
import {getRepoId} from '~/utils/github'

async function main() {
	const projects = await prisma.project.findMany({
		where: {
			githubProjectId: null
		},
		select: {
			id: true,
			githubProjectId: true,
			name: true,
			user: {
				select: {
					userName: true
				}
			}
		}
	})

	console.log('projects', projects)

	for (const project of projects) {
		console.log('project', project)
		const repoId = await getRepoId(`${project.user.userName}/${project.name}`)
		console.log('repoId', repoId)

		await prisma.project.update({
			where: {
				id: project.id
			},
			data: {
				githubProjectId: repoId.toString()
			}
		})
		console.log('updated')
	}
	return 'done'
}

await main()
