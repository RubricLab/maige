import Image from 'next/image'
import Link from 'next/link'
import {env} from 'process'
import tatooine from '~/assets/tatooine.png'
import {Footer} from '~/components/Footer'
import {Header} from '~/components/Header'

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

const DemoVideo = () => (
	<div className='z-10 w-full'>
		<div className='mx-[5%]'>
			<iframe
				src={`https://www.loom.com/embed/1f8fc747459d44659dc508460cf44208?sid=5820036c-e4fc-4343-b9ad-7f350af10dee?${loomQueryParams}`}
				allowFullScreen
				className='relative my-auto block aspect-[7/4] h-auto w-full overflow-hidden border-4 border-secondary'
			/>
		</div>
	</div>
)

const Page = () => {
	return (
		<div className='relative w-screen'>
			<Header />
			<section className='center relative mx-auto min-h-screen max-w-5xl space-y-4 pt-16 sm:space-y-10 sm:pt-[25vh]'>
				<div className='max-w-3xl space-y-4'>
					<h1 className='relative text-primary sm:text-7xl dark:text-orange-100'>
						<span className='absolute left-px top-px -z-10 text-secondary'>
							intelligent codebase copilot
						</span>
						<span>intelligent codebase copilot</span>
					</h1>
					<h2 className='font-monocraft text-secondary'>
						maige lets you run natural language workflows on your codebase
					</h2>
				</div>
				<CTAButton />
				<DemoVideo />
			</section>
			<section className='relative h-screen'></section>
			<section className='relative h-screen'></section>
			<section className='relative h-screen'></section>
			<section className='relative h-screen'>
				<Image
					src={tatooine}
					alt='Future desert scene'
					className='h-full object-cover'
				/>
			</section>
			<Footer />
		</div>
	)
}

export default Page
