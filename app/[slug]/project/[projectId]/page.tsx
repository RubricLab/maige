import { ArrowUp } from "lucide-react";
import prisma from "~/prisma";

const EmptyState = () => (
	<div className="space-y-2 text-sm">
		<p className="text-tertiary">
			There&apos;s nothing here yet. Your history will show here soon.
		</p>
		<div className="flex items-center gap-2">
			<p className="text-secondary">Go to Instructions to get started.</p>
			<ArrowUp className="h-5 w-5" />
		</div>
	</div>
);

export default async function Page({
	params,
}: { params: { projectId: string } }) {
	const project = await prisma.project.findUnique({
		where: { id: params.projectId },
	});
	return (
		<div className="flex flex-col gap-4">
			<h3>{project?.name}</h3>
			<EmptyState />
		</div>
	);
}
