import Image from 'next/image'
import Link from 'next/link'
import wizardHatLogo from '../../public/logo.png'

export const Header = () => {
	return (
		<header className='absolute top-0 z-10 flex w-screen items-center justify-start p-2'>
			<Link href='/'>
				<Image
					src={wizardHatLogo}
					alt='Wizard hat logo'
					className='h-12 w-12 rounded-full object-cover'
				/>
			</Link>
			<div />
		</header>
	)
}
