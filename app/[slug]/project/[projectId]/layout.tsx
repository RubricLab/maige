import ProjectNav from '~/components/dashboard/Navigation/ProjectNav'

export default async function Layout({
	params,
	children
}: {
	params: { slug: string; projectId: string }
	children: React.ReactNode
}) {
	return (
		<div className="space-y-4">
			<ProjectNav projectId={params.projectId} repoSlug={params.slug} />
			<div className="z-10 h-full w-full">{children}</div>
		</div>
	)
}
