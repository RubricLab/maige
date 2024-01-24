import Link from 'next/link'
import {Sun} from './dashboard/Buttons/Sun'
import {Maige} from './logos'

export const Header = () => {
	return (
		<header className='bg-primary fixed top-0 z-20 flex w-screen items-center justify-start p-4'>
			<Link
				href='/'
				className='text-primary group flex flex-col'>
				<div className='flex items-baseline gap-2 opacity-80 transition-all hover:text-orange-200 hover:opacity-100 dark:text-orange-100'>
					<Maige className='h-8' />
					<div className='font-monocraft text-3xl font-bold !tracking-tighter'>
						maige
					</div>
				</div>
				<div className='flex justify-end'>
					<span className='text-sm opacity-80 dark:text-orange-100'>alpha</span>
				</div>
			</Link>
			<div className='grow'>{/* Divider */}</div>
			<Sun />
		</header>
	)
}
