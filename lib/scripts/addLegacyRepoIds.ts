/*
 * From Root: bun --env-file=.env.local lib/scripts/addLegacyRepoIds.ts
 */

import prisma from '~/prisma'
import {getRepoFullName, getRepoId} from '~/utils/github'

async function main() {
	const projects = await prisma.project.findMany({
		where: {
			githubProjectId: null
		},
		select: {
			id: true,
			name: true
		}
	})

	console.log('projects', projects)

	for (const project of projects) {
		const repoFullName = await getRepoFullName(project.name)

		console.log('repo name:', repoFullName)
		const repoId = await getRepoId(repoFullName)
		console.log('repo id:', repoId)

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
