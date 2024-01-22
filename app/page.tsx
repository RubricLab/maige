import Image from 'next/image'
import Link from 'next/link'
import {env} from 'process'
import joshuaTreeDay from '~/assets/joshua-tree-day.png'
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
		<div className='relative w-screen space-y-6 sm:space-y-12'>
			<Header />
			<div className='absolute right-2 top-0 ml-auto h-8 w-8 rounded-full bg-gradient-to-t from-red-700 to-red-500 drop-shadow-glow' />
			{/* Hero */}
			<section className='center relative mx-auto min-h-screen max-w-5xl space-y-4 pt-16 sm:space-y-10 sm:pt-[25vh]'>
				<div className='max-w-3xl space-y-4'>
					<h1 className='relative text-primary sm:text-7xl dark:text-orange-100'>
						<span className='absolute left-px top-px -z-10 text-secondary'>
							intelligent codebase copilot
						</span>
						<span>intelligent codebase copilot</span>
					</h1>
					<h2 className='font-sans text-secondary'>
						maige lets you run natural language workflows on your codebase
					</h2>
				</div>
				<CTAButton />
				<DemoVideo />
				<div className='absolute -left-10 top-2/3 w-10 break-words text-center'>
					<div className='bg-sunset absolute top-1/3 -z-10 h-56 w-full' />
					<span className='font-monocraft text-tertiary text-4xl'>
						version one: 01 / 23 / 24
					</span>
				</div>
			</section>
			{/* How-to */}
			<section className='center h-screen space-y-10 text-secondary sm:space-y-24'>
				<div className='max-w-xl space-y-4'>
					<h2 className='text-primary'>1. Connect your repo</h2>
					<p className='text-xl'>
						When you connect, we create three things: a webhook, embeddings of your
						entire codebase, and a sandbox environment.
					</p>
				</div>
				<div className='flex w-full flex-wrap items-center gap-6 sm:gap-12'>
					<Image
						src={joshuaTreeDay}
						alt='Future desert scene'
						className='h-auto w-1/2 opacity-80'
					/>
					<div className='max-w-md space-y-4'>
						<h2 className='text-primary'>2. Write your rules</h2>
						<p className='text-xl'>
							Simply describe what should happen when issues and PRs are opened.
						</p>
						<p className='text-xl'>
							Maige can label, assign, comment, review code, and even run simple code
							snippets.
						</p>
					</div>
				</div>
				<div className='max-w-xl space-y-4'>
					<h2 className='text-primary'>3. Watch it run</h2>
					<p className='text-xl'>
						Tell your community how to leverage your workflows. Monitor runs and
						provide feedback in our dashboard.
					</p>
				</div>
			</section>
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
