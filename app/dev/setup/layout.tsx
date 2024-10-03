import { Header } from '~/components/Header'

export default async function InviteLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className="relative min-h-screen w-full">
			<Header />
			<div className="-translate-x-[50%] -translate-y-[50%] absolute top-[50%] left-[50%]">
				{children}
			</div>
		</div>
	)
}
