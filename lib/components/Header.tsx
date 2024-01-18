import Link from 'next/link'
import {Maige} from './logos'

export const Header = () => {
	return (
		<header className='rounded-b-4xl fixed top-0 z-20 flex w-screen items-center justify-start p-4 backdrop-blur-xl'>
			<Link
				href='/'
				className='flex items-baseline gap-2 text-orange-100 transition-colors hover:text-orange-200'>
				<Maige className='h-8' />
				<div className='font-jakarta text-2xl font-bold !tracking-tighter'>
					Maige
				</div>
			</Link>
			<div />
		</header>
	)
}
