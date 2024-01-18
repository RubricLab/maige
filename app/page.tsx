import Image from 'next/image'
import Link from 'next/link'
import {env} from 'process'
import {Footer} from '~/components/Footer'
import {Header} from '~/components/Header'
import {Line1} from '~/components/assets/lines/1'
import desert from '../lib/assets/desert-tall.png'

const loomConfig = {
	hide_owner: 'true',
	hideEmbedTopBar: 'true',
	hide_share: 'true',
	hide_title: 'true',
	default_speed: 'true',
	skip_embed_eovn: 'true'
}
const loomQueryParams = new URLSearchParams(loomConfig).toString()

const CTAButton = () => (
	<Link
		href={`https://github.com/apps/${env.GITHUB_APP_NAME}`}
		rel='noopener noreferrer'>
		<button className='w-72 rounded-lg bg-green-700 p-3 text-xl font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-green-600/60 enabled:hover:bg-green-600 disabled:opacity-80'>
			Add to your repo
		</button>
	</Link>
)

const Page = () => {
	return (
		<div className='relative w-screen bg-black'>
			<Header />
			<section className='center rounded-b-5xl !z-10 h-[150vh] w-full !justify-start bg-black'>
				<div className='center min-h-screen w-full space-y-12 pt-40 text-center'>
					<h1 className='max-w-5xl bg-gradient-to-b from-white to-gray-400 bg-clip-text text-center text-5xl text-transparent sm:text-8xl'>
						Flexible, intelligent action runner
					</h1>
					<h2 className='max-w-3xl text-secondary'>
						Maige allows you to run natural-language workflows on your codebase.
					</h2>
					<CTAButton />
					<div className='z-10 w-full'>
						<div className='mx-[10%] rounded-xl'>
							<iframe
								src={`https://www.loom.com/embed/1f8fc747459d44659dc508460cf44208?sid=5820036c-e4fc-4343-b9ad-7f350af10dee?${loomQueryParams}`}
								allowFullScreen
								className='relative -mx-1 my-auto block aspect-video h-auto w-full overflow-hidden rounded-xl border-2 border-white'
							/>
						</div>
					</div>
					<div>
						<h2>
							Maige allows you to run natural-language workflows on your codebase.
						</h2>
					</div>
				</div>
			</section>
			<section className='center h-[300vh] w-full bg-gradient-to-b from-black via-orange-900 to-blue-200 pb-40'>
				<Line1 className='absolute top-[70vh] z-0 w-screen' />
				<div className='h-screen w-full'>
					<div className='rounded-r-4xl mr-auto h-96 border-2 border-white bg-black/30 backdrop-blur-3xl sm:w-1/2'></div>
					<div className='rounded-l-4xl ml-auto h-96 border-2 border-white bg-black/30 backdrop-blur-3xl sm:w-1/2'></div>
					<div className='rounded-r-4xl mr-auto h-96 border-2 border-white bg-black/30 backdrop-blur-3xl sm:w-1/2'></div>
				</div>
			</section>
			<section className='min-h-screen w-full bg-gradient-to-b from-blue-200 to-black pb-20'>
				<div className='relative h-screen'>
					<Image
						src={desert}
						alt='Future desert scene'
						className='rounded-5xl h-full object-cover'
					/>
					<div className='absolute left-0 top-0 h-full w-full p-10 sm:p-20'>
						<div className='rounded-5xl h-full w-full border-2 border-white bg-black/30 backdrop-blur-3xl'>
							<div className='center h-full gap-4'>
								<h1 className='text-5xl'>Maige is free to try.</h1>
								<CTAButton />
								<div>Free to get started.</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<Footer />
		</div>
	)
}

export default Page
