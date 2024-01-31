import Link from 'next/link'
import {Sun} from './dashboard/Buttons/Sun'
import {Maige} from './logos'

export const Header = () => {
	return (
		<header className='bg-primary fixed top-0 z-20 flex w-screen items-center justify-start p-4'>
			<Link
				href='/'
				className='text-primary group flex flex-col'>
				<div className='flex items-center gap-2 opacity-80 transition-all hover:text-orange-200 hover:opacity-100 dark:text-orange-100'>
					<Maige className='h-8' />
					<div className='flex flex-col items-end justify-center'>
						<span className='text-sm leading-3 opacity-80 dark:text-orange-100'>
							alpha
						</span>
						<div className='font-monocraft text-3xl font-bold leading-4 !tracking-tighter'>
							maige
						</div>
					</div>
				</div>
			</Link>
			<div className='grow'>{/* Divider */}</div>
			<Sun />
		</header>
	)
}
