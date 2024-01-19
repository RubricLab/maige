import Image from 'next/image'
import Link from 'next/link'
import {env} from 'process'
import {Footer} from '~/components/Footer'
import {Header} from '~/components/Header'
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
		<button className='w-72 bg-green-700 p-3 text-xl font-medium text-white transition-all hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/60'>
			Add to your repo
		</button>
	</Link>
)

const Page = () => {
	return (
		<div className='relative w-screen'>
			<Header />
			<section className='center !z-10 h-[150vh] w-full !justify-start bg-black'>
				<div className='center min-h-screen w-full space-y-12 pt-40'>
					<div>
						<h1 className='max-w-5xl text-secondary'>intelligent github actions</h1>
						<h2 className='max-w-3xl text-secondary'>
							maige lets you run natural language workflows on your codebase
						</h2>
					</div>
					<CTAButton />
					<div className='z-10 w-full'>
						<div className='mx-[10%]'>
							<iframe
								src={`https://www.loom.com/embed/1f8fc747459d44659dc508460cf44208?sid=5820036c-e4fc-4343-b9ad-7f350af10dee?${loomQueryParams}`}
								allowFullScreen
								className='relative my-auto block aspect-video h-auto w-full overflow-hidden border-2 border-white/80'
							/>
						</div>
					</div>
					<div>
						<h2>
							Maige can label, assign, comment, link, and even code. Just say the word.
						</h2>
					</div>
				</div>
			</section>
			<section className='center h-[300vh] w-full pb-40'>
				<div className='h-screen w-full'></div>
			</section>
			<section className='min-h-screen w-full pb-20'>
				<div className='relative h-screen'>
					<Image
						src={desert}
						alt='Future desert scene'
						className='rounded-5xl h-full object-cover'
					/>
					<div className='absolute left-0 top-0 h-full w-full p-10 sm:p-20'>
						<div className='rounded-5xl h-full w-full border-2 border-white '>
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
