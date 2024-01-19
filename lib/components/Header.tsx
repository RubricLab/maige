import Link from 'next/link'
import {Maige} from './logos'

export const Header = () => {
	return (
		<header className='fixed top-0 z-20 flex w-screen items-center justify-start bg-primary p-4'>
			<Link
				href='/'
				className='flex items-center gap-2 text-orange-100 transition-colors hover:text-orange-200'>
				<Maige className='h-8' />
				<div className='font-monocraft text-4xl font-bold !tracking-tighter'>
					maige
				</div>
			</Link>
			<div />
		</header>
	)
}
