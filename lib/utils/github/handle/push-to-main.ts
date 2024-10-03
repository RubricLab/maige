import { App } from "@octokit/app";
import type { PushEvent } from "@octokit/webhooks-types";
import env from "~/env";
import prisma from "~/prisma";
import Weaviate from "~/utils/embeddings/db";

export default async function handlePush({ payload }: { payload: PushEvent }) {
	const {
		installation,
		sender: { login: senderGithubUserName },
		repository,
		head_commit,
		ref,
	} = payload;

	if (!installation) throw "no installation";
	const { id: instanceId } = installation;

	const user = await prisma.user.findUnique({
		where: { userName: senderGithubUserName },
		select: { id: true },
	});

	const membership = user
		? await prisma.project.findFirst({
				where: {
					githubProjectId: repository.id.toString(),
					team: {
						memberships: {
							some: {
								userId: user.id,
							},
						},
					},
				},
				include: {
					team: {
						include: {
							memberships: true,
						},
					},
				},
			})
		: null;

	const app = new App({
		appId: env.GITHUB_APP_ID || "",
		privateKey: env.GITHUB_PRIVATE_KEY || "",
	});
	const octokit = await app.getInstallationOctokit(instanceId);

	if (head_commit && ref === `refs/heads/${repository.master_branch}`) {
		if ((membership ? user?.id : null) == null)
			return new Response("User not authorized", { status: 404 });
		const vectorDB = new Weaviate(user?.id as string);
		await vectorDB.updateRepo(
			repository.full_name,
			repository.html_url,
			head_commit.id,
			repository.master_branch as string,
			octokit,
		);
		return new Response("Repo updated", { status: 200 });
	}
	return;
}
