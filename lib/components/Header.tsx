import Link from 'next/link'
import { Sun } from './dashboard/Buttons/Sun'
import { Maige } from './logos'

export const Header = () => {
	return (
		<header className="fixed top-0 z-20 flex w-screen items-center justify-start bg-primary p-4">
			<Link href="/" className="group flex flex-col text-primary">
				<div className="flex items-end gap-2 opacity-80 transition-all hover:text-orange-200 hover:opacity-100 dark:text-orange-100">
					<Maige className="h-8" />
					<div className="-mb-1 !tracking-tighter font-bold font-monocraft text-3xl">maige</div>
					<span className="-mb-0.5 rounded-sm bg-tertiary px-1 text-sm text-tertiary">alpha</span>
				</div>
			</Link>
			<div className="grow">{/* Divider */}</div>
			<Sun />
		</header>
	)
}
