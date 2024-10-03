import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import type { ProjectWithInstructions } from "~/types/prisma";
import { timeAgo } from "~/utils";

export default function ProjectCard({
	username,
	teamSlug,
	project,
}: {
	username: string;
	teamSlug: string;
	project: ProjectWithInstructions;
}) {
	return (
		<div className="relative flex h-36 w-full cursor-pointer rounded-sm border border-tertiary transition-all hover:border-secondary">
			<Link
				target="_blank"
				href={`https://github.com/${project.organization ? project.organization?.slug : username}/${project.name}`}
				className="center absolute top-4 right-4 h-6 w-6 rounded-full bg-tertiary text-secondary transition-colors hover:bg-secondary"
			>
				<ExternalLinkIcon className="h-4 w-4 text-tertiary" />
			</Link>
			<Link
				className="flex h-full w-full flex-col justify-between p-4 py-3.5"
				href={`${teamSlug}/project/${project.id}/instructions`} // TODO: remove after populating Overview tab
			>
				<div className="flex w-full items-center justify-between">
					<div className="flex w-full items-center gap-3">
						<div className="relative">
							<div className="h-6 w-6 rounded-full bg-foreground" />
							<p className="-translate-y-1/2 absolute top-1/2 right-0 left-0 m-auto text-center font-medium text-background leading-none">
								{(project.name as string).charAt(0).toUpperCase()}
							</p>
						</div>
						<p className="mr-4 truncate text-lg">{project.name}</p>
						<div className="grow" />
					</div>
				</div>
				<div className="flex flex-col gap-1">
					<span className="font-medium">
						{project.instructions?.length} Custom Instructions
					</span>
					<span className="text-gray-500 text-sm">
						Added {timeAgo(project.createdAt)}
					</span>
				</div>
			</Link>
		</div>
	);
}
