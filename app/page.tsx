import Image from 'next/image'
import {Auth} from '~/components/Auth'
import {Footer} from '~/components/Footer'
import {Header} from '~/components/Header'
import Cal from '~/components/logos/Cal'
import Highlight from '~/components/logos/Highlight'
import Precedent from '~/components/logos/Precedent'
import Trigger from '~/components/logos/Trigger'
import demoSrc from '../public/assets/demo.png'

const Page = () => {
	return (
		<div className='bg-black'>
			<Header />
			<main className='relative flex h-screen w-screen flex-col items-center'>
				<div className='flex grow flex-col items-center justify-center space-y-2'>
					<div className='flex flex-row items-center justify-center gap-2 sm:flex-col'>
						<h1 className='bg-gradient-to-l from-orange-200 to-indigo-800 bg-clip-text text-lg font-bold leading-normal tracking-tight text-transparent sm:pb-4 sm:text-8xl'>
							Maige
						</h1>
						<h2 className='text:lg font-medium leading-3 tracking-tight text-white/80 sm:pb-8 sm:text-3xl'>
							Have AI label your issues.
						</h2>
					</div>
					<div className='flex max-w-full flex-col items-center space-y-10 py-8'>
						<div className='flex h-auto w-full flex-col items-center gap-2'>
							<Image
								alt='Demo of Maige labelling an issue'
								src={demoSrc}
								className='h-full w-auto rounded-md object-cover ring-4 ring-green-700 ring-opacity-50'
							/>
							<p className='text-sm text-white/60'>
								That&apos;s it. That&apos;s all it does for now.
							</p>
						</div>
						<div className='flex flex-col items-center space-y-1'>
							<Auth />
							<p className='text-xs text-white/60'>Free to try.</p>
						</div>
						<div className='flex flex-col items-center space-y-2 text-center text-white/60'>
							<p className='text-xs sm:text-sm'>
								New issues will be labelled automatically.
							</p>
							<p className='text-xs sm:text-sm'>
								Comment{' '}
								<span className='font-medium text-white'>
									&quot;Maige label this&quot;
								</span>{' '}
								to label an existing issue.
							</p>
							<p className='text-xs sm:text-sm'>
								Comment{' '}
								<span className='font-medium text-white'>
									&quot;Maige [instructions]&quot;
								</span>{' '}
								to add custom instructions.
							</p>
							<p className='text-xs sm:text-sm'>
								Comment{' '}
								<span className='font-medium text-white'>
									&quot;Maige [question]&quot;
								</span>{' '}
								to ask a question about a codebase.
							</p>
						</div>
					</div>
					<div className='flex flex-col items-center gap-2 py-8'>
						<p className='text-sm text-white/60'>Used by 1.7k+ repos</p>
						<div className='flex flex-row flex-wrap items-center justify-center gap-5 text-white/60'>
							<Highlight className='h-6 hover:text-white' />
							<Precedent className='group h-6 hover:text-white' />
							<Cal className='h-5 hover:text-white' />
							<Trigger className='h-6 hover:text-white' />
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	)
}

export default Page
