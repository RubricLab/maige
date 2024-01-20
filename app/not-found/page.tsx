import Link from 'next/link'
import env from '~/env.mjs'

type Props = {}

export default function NotFound({}: Props) {
	return (
		<div className='flex h-screen flex-col items-center justify-center gap-2'>
			<span className='font-semibold text-white/60'>
				To get started, add Maige to a repo!
			</span>
			<div className='flex flex-col items-center space-y-1'>
				<Link
					href={`https://github.com/apps/${env.GITHUB_APP_NAME}`}
					rel='noopener noreferrer'>
					<button className='w-72 rounded-sm bg-green-700 p-3 text-xl font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-green-600/60 enabled:hover:bg-green-600 disabled:opacity-80'>
						Add to your repo
					</button>
				</Link>
				<p className='text-xs text-white/60'>Free to try.</p>
			</div>
		</div>
	)
}
