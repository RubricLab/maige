import SettingsNav from '~/components/dashboard/Navigation/SettingsNav'

export default async function Layout({
	params,
	children
}: {
	params: {slug: string; projectId: string}
	children: React.ReactNode
}) {
	return (
		<div className='flex h-full w-full gap-4'>
			<SettingsNav
				teamSlug={params.slug}
				projectId={params.projectId}
			/>
			<div className='h-full w-full max-w-2xl'>{children}</div>
		</div>
	)
}
