import Image from 'next/image'
import Link from 'next/link'
import {env} from 'process'
import future from '~/assets/future.png'
import joshuaTreeDay from '~/assets/joshua-tree-day.png'
import joshuaTreeNight from '~/assets/joshua-tree-night.png'
import labelFlow from '~/assets/label-flow.png'
import {Header} from '~/components/Header'
import {Cal, Highlight, Precedent, Trigger} from '~/components/logos'
import {Nuxt} from '~/components/logos/Nuxt'

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
		<button className='w-72 rounded-sm bg-green-700 p-3 text-xl font-medium text-white transition-all hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/60'>
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
				className='relative my-auto block aspect-[7/4] h-auto w-full overflow-hidden rounded-xl border-4 border-secondary'
			/>
		</div>
	</div>
)

const Page = () => {
	return (
		<div className='relative w-screen space-y-6 overflow-hidden sm:space-y-12'>
			<Header />
			{/* Hero */}
			<section className='center relative mx-auto min-h-screen max-w-5xl space-y-4 pt-16 sm:space-y-10 sm:pt-[25vh]'>
				<div className='max-w-3xl space-y-6'>
					<h1 className='relative text-primary sm:text-7xl dark:text-orange-200'>
						<span className='absolute left-px top-px -z-10 text-secondary'>
							intelligent codebase copilot
						</span>
						<span>intelligent codebase copilot</span>
					</h1>
					<h2 className='font-sans font-semibold text-secondary'>
						run natural language workflows on your codebase
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
			{/* Logos */}
			<section className='center space-y-16 p-12 sm:p-24'>
				<p className='font-monocraft text-tertiary'>Used by 1.8k++ repos:</p>
				<div className='center gap-12 sm:gap-14'>
					<Cal className='h-10 opacity-60 transition-opacity hover:opacity-100' />
					<Trigger className='h-10 opacity-60 transition-opacity hover:opacity-100' />
					<Precedent className='h-10 opacity-60 transition-opacity hover:opacity-100' />
					<Highlight className='h-10 opacity-60 transition-opacity hover:opacity-100' />
					<Nuxt className='h-10 opacity-60 transition-opacity hover:opacity-100' />
				</div>
			</section>
			{/* How-to */}
			<section className='center min-h-screen space-y-10 py-24 text-secondary sm:space-y-24 sm:py-40'>
				<h1 className='text-tertiary mr-auto pl-10 sm:text-7xl'>
					Get going in a few clicks:
				</h1>
				<div className='max-w-xl space-y-4'>
					<h2 className='text-primary'>1. Connect your repo</h2>
					<p className='text-xl'>
						When you connect, we create three things: a webhook, embeddings of your
						entire codebase, and a sandbox environment.
					</p>
				</div>
				<div className='flex w-full flex-wrap items-center gap-6 sm:gap-12'>
					<div className='center relative w-full p-6 sm:w-1/2'>
						<Image
							src={joshuaTreeDay}
							alt='Joshua tree at day'
							className='object-cover'
						/>
						<Image
							src={labelFlow}
							alt='Maige labelling flow'
							className='absolute w-5/6'
						/>
					</div>
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
			<section className='center font-monocraft relative h-screen !flex-row gap-8 py-8 sm:py-24'>
				<div className='bg-sunset absolute right-10 top-10 h-screen w-8' />
				<Image
					src={joshuaTreeNight}
					alt='Joshua tree at night'
					className='h-auto w-1/2'
				/>
				<div className='center z-10 grow !items-start text-left text-xl text-green-500'>
					<div className='max-w-lg space-y-8 sm:space-y-20'>
						<p>
							- maige is an AI with access to GitHub. it can do anything you could do
							in the UI.
						</p>
						<p> + It labels your issues automatically</p>
						<p className='text-yellow-500'>
							| There&apos;s also a code sandbox that it can spin up
						</p>
						<p>+ It can also review PRs</p>
						<p>+ The whole thing is customizable with text</p>
					</div>
				</div>
			</section>
			<section className='relative h-screen'>
				<h1>Pricing</h1>
			</section>
			<section className='center relative h-screen w-screen space-y-4 text-green-200'>
				<p className='font-monocraft text-xl font-medium'>
					Maige is an open-source experiment by Rubric Labs
				</p>
				<p>a new way to build</p>
				<p>get started now</p>
				<CTAButton />
				<Image
					src={future}
					alt='Future desert scene'
					className='absolute -z-10 h-full w-full object-cover opacity-40'
				/>
			</section>
			{/* <Footer /> */}
		</div>
	)
}

export default Page
