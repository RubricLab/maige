import Image from 'next/image'
import Link from 'next/link'
import fullFlow from '~/assets/full-flow.png'
import future from '~/assets/future.png'
import instructionsUi from '~/assets/instructions-ui.png'
import joshuaTreeDay from '~/assets/joshua-tree-day.png'
import joshuaTreeNight from '~/assets/joshua-tree-night.png'
import spaceGreenhouse from '~/assets/spaceship-greenhouse.png'
import {Auth} from '~/components/Auth'
import {Header} from '~/components/Header'
import {LabelFlow} from '~/components/assets/LabelFlow'
import {Logos} from '~/components/logos/Logos'

const loomConfig = {
	hide_owner: 'true',
	hideEmbedTopBar: 'true',
	hide_share: 'true',
	hide_title: 'true',
	default_speed: '1.2',
	skip_embed_eovn: 'true'
}
const loomQueryParams = new URLSearchParams(loomConfig).toString()

const DemoVideo = () => (
	<div className='z-10 w-full'>
		<div className='mx-4 sm:mx-12'>
			<iframe
				src={`https://www.loom.com/embed/1f8fc747459d44659dc508460cf44208?sid=5820036c-e4fc-4343-b9ad-7f350af10dee?${loomQueryParams}`}
				allowFullScreen
				className='border-secondary relative my-auto block aspect-[7/4] h-auto w-full overflow-hidden rounded-xl border-4'
			/>
		</div>
	</div>
)

export const Homepage = () => {
	const todayString = new Date().toISOString().split('T')[0].replaceAll('-', '/')
	return (
		<div className='relative w-screen space-y-6 overflow-hidden sm:space-y-12'>
			<Header />
			{/* Hero */}
			<section className='center relative mx-auto min-h-screen max-w-5xl space-y-6 pt-16 sm:space-y-12 sm:pt-40'>
				<div className='max-w-4xl space-y-6 px-4 text-center'>
					<h1 className='text-primary relative sm:text-7xl dark:text-orange-100'>
						<span className='text-tertiary absolute left-0.5 top-0.5 -z-10'>
							intelligent codebase copilot
						</span>
						<span>intelligent codebase copilot</span>
					</h1>
					<h2 className='font-sans font-medium'>
						Maige is open-source infrastucture for running natural language workflows
						on your codebase.
					</h2>
				</div>
				<Auth />
				<DemoVideo />
				<div className='absolute -left-10 top-2/3 w-10 break-words text-center'>
					<div className='absolute top-1/3 -z-10 h-56 w-full bg-sunset' />
					<span className='text-tertiary font-monocraft text-4xl'>
						version one: {todayString}
					</span>
				</div>
			</section>
			{/* Logos */}
			<section className='center space-y-14 p-4 sm:p-24'>
				<Logos />
			</section>
			{/* How-to */}
			<section className='center text-secondary min-h-screen space-y-12 px-4 py-20 sm:space-y-16 sm:py-40'>
				<h1 className='text-tertiary'>Get started in a few clicks:</h1>
				<div className='max-w-xl space-y-3 text-center'>
					<span className='text-tertiary font-monocraft text-7xl'>1</span>
					<h2 className='text-primary font-jakarta'>Connect your repo</h2>
					<p className='text-xl'>
						When you connect, we create three things: a webhook, embeddings of your
						entire codebase, and a sandbox environment.
					</p>
				</div>
				<div className='flex w-full flex-wrap items-center gap-12 sm:gap-16 sm:p-6'>
					<div className='center relative w-full sm:w-1/2 '>
						<Image
							src={spaceGreenhouse}
							alt='Astronaut attending to a spaceship greenhouse'
							className='rounded-sm object-cover opacity-80'
						/>
						<Image
							src={instructionsUi}
							alt='Maige labelling flow'
							className='absolute w-11/12 rounded-sm shadow-2xl sm:w-5/6'
						/>
					</div>
					<div className='max-w-md space-y-3'>
						<span className='text-tertiary font-monocraft text-7xl'>2</span>
						<h2 className='text-primary font-jakarta'>Write your rules</h2>
						<p className='text-xl'>
							Simply describe what should happen when issues and PRs are opened.
						</p>
						<p className='text-xl'>
							Maige can label, assign, comment, review code, and even run simple code
							snippets.
						</p>
					</div>
				</div>
				<div className='flex w-full flex-wrap items-center justify-end gap-12'>
					<div className='max-w-md space-y-3 text-right sm:pl-8'>
						<span className='text-tertiary font-monocraft text-7xl'>3</span>
						<h2 className='text-primary font-jakarta'>Watch it run</h2>
						<p className='text-xl'>
							Tell your community how to leverage your workflows. Monitor runs and
							provide feedback in our dashboard.
						</p>
					</div>
					<div className='center relative w-full sm:w-1/2 sm:p-6'>
						<Image
							src={joshuaTreeDay}
							alt='Joshua tree at day'
							className='rounded-sm object-cover opacity-80'
						/>
						<LabelFlow className='absolute w-11/12 rounded-sm shadow-2xl sm:w-5/6' />
					</div>
				</div>
			</section>
			{/* Examples */}
			<section className='text-tertiary px-4 pb-20 sm:px-12'>
				<div className='flex max-w-3xl flex-col space-y-8 '>
					<h2>Maige works flexibly with the GitHub API to find a way.</h2>
					<div className='text-secondary space-y-6 text-2xl'>
						<p>
							+ maige always <span className='text-green-600'>assign</span>{' '}
							<span className='text-yellow-600'>UI-related</span> issues to @username
						</p>
						<p>
							+ maige <span className='text-green-600'>label</span> .env PRs as
							&apos;needs-approval&apos;{' '}
							<span className='text-yellow-600'>unless</span> opened by @maintainer
						</p>
						<p>
							+ maige <span className='text-green-600'>review</span> all incoming PRs
							per our <span className='text-yellow-600'>CONTRIBUTING.md</span>
						</p>
					</div>
				</div>
			</section>
			{/* Description */}
			<section className='center relative min-h-screen gap-8 py-8 font-monocraft sm:flex-row'>
				<div className='absolute right-4 top-10 h-screen w-9 bg-sunset sm:right-10' />
				<div className='z-10 flex w-full flex-col text-xl text-green-600 sm:pl-16'>
					<div className='max-w-sm space-y-10 px-4 sm:max-w-lg sm:space-y-16'>
						<p>
							+ maige is an AI with access to GitHub. it can do anything you could do
							in the UI.
						</p>
						<p> + It labels your issues automatically</p>
						<p className='text-yellow-600'>
							| There&apos;s also a code sandbox that it can spin up
						</p>
						<p>+ It can also review PRs</p>
						<p>+ The whole thing is customizable with text</p>
					</div>
				</div>
				<div className='center relative w-full sm:p-6'>
					<Image
						src={joshuaTreeNight}
						alt='Joshua tree at night'
						className='rounded-sm object-cover opacity-90'
					/>
					<Image
						src={fullFlow}
						alt='Maige commenting flow'
						className='absolute w-11/12 rounded-sm shadow-2xl sm:w-5/6'
					/>
				</div>
			</section>
			{/* Pricing */}
			<section className='center relative min-h-screen space-y-8 px-4'>
				<div className='center space-y-4'>
					<h1 className='text-secondary'>Pricing</h1>
					<p className='text-tertiary text-xl'>
						Try Maige for free, then pay by usage.
					</p>
				</div>
				<div className='flex flex-wrap gap-4'>
					<div className='center border-primary w-full rounded-sm border p-4 sm:w-96 sm:p-10'>
						<div className='text-tertiary space-y-3 pb-8'>
							<h2 className='text-secondary font-jakarta'>Standard Plan</h2>
							<p className='text-primary text-2xl font-medium'>
								$30.00 USD/<span className='text-secondary'>month</span>
							</p>
							<div className='space-y-2'>
								<p>First 30 issues free to push Maige to its limits.</p>
								<p>+ Auto-labelling</p>
								<p>+ Auto-assignment</p>
								<p>+ Auto-comments</p>
								<p>+ Custom instructions</p>
								<p>+ Code review</p>
								<p>+ Code generation</p>
							</div>
						</div>
						<Auth text='Start for free' />
						<p className='text-tertiary mt-1 text-sm'>No credit card required</p>
					</div>
					<div className='text-tertiary border-tertiary w-full space-y-3 rounded-sm border p-4 sm:w-96 sm:p-10'>
						<h2 className='font-jakarta'>Enterprise</h2>
						<p>Best for large teams.</p>
						<p>Coming soon.</p>
					</div>
				</div>
			</section>
			{/* Footer */}
			<section className='center text-primary relative h-screen w-screen space-y-4'>
				<div className='from-primary to-primary absolute h-full w-full bg-gradient-to-b via-transparent opacity-30' />
				<div className='z-10 space-x-1 px-4 text-center font-jakarta text-xl'>
					<span>an</span>
					<Link
						className='underline'
						href='https://github.com/RubricLab/maige'
						target='_blank'>
						open-source
					</Link>
					<span>experiment by</span>
					<Link
						className='underline'
						href='https://rubriclabs.com'
						target='_blank'>
						Rubric Labs
					</Link>
				</div>
				<Image
					src={future}
					alt='Future desert scene'
					className='absolute -z-10 h-full w-full object-cover opacity-50'
				/>
			</section>
		</div>
	)
}

const Page = async () => {
	return <Homepage />
}

export default Page
