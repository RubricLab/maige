import {App} from '@octokit/app'
import {PushEvent} from '@octokit/webhooks-types'
import env from '~/env.mjs'
import prisma from '~/prisma'
import Weaviate from '~/utils/embeddings/db'

export default async function handlePush({payload}: {payload: PushEvent}) {
	const {
		installation: {id: instanceId},
		sender: {login: senderGithubUserName},
		repository,
		head_commit,
		ref
	} = payload

	const user = await prisma.user.findUnique({
		where: {userName: senderGithubUserName},
		select: {id: true}
	})

	const membership = user
		? await prisma.project.findFirst({
				where: {
					githubProjectId: repository.id.toString(),
					team: {
						memberships: {
							some: {
								userId: user.id
							}
						}
					}
				},
				include: {
					team: {
						include: {
							memberships: true
						}
					}
				}
			})
		: null

	const app = new App({
		appId: env.GITHUB_APP_ID || '',
		privateKey: env.GITHUB_PRIVATE_KEY || ''
	})
	const octokit = await app.getInstallationOctokit(instanceId)

	if (head_commit && ref === `refs/heads/${repository.master_branch}`) {
		if ((membership ? user.id : null) == null)
			return new Response('User not authorized', {status: 404})
		const vectorDB = new Weaviate(user.id)
		await vectorDB.updateRepo(
			repository.full_name,
			repository.html_url,
			head_commit.id,
			repository.master_branch,
			octokit
		)
		return new Response('Repo updated', {status: 200})
	}
	return
}
