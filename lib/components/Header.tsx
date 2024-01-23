import Link from 'next/link'
import {Sun} from './dashboard/Buttons/Sun'
import {Maige} from './logos'

export const Header = () => {
	return (
		<header className='fixed top-0 z-20 flex w-screen items-center justify-start bg-primary p-4'>
			<Link
				href='/'
				className='flex items-baseline gap-2 text-primary opacity-80 transition-all hover:text-orange-200 hover:opacity-100 dark:text-orange-100'>
				<Maige className='h-8' />
				<div className='font-monocraft text-3xl font-bold !tracking-tighter'>
					maige
				</div>
			</Link>
			<div className='grow'>{/* Divider */}</div>
			<Sun />
		</header>
	)
}
