import Link from 'next/link'
import {cn} from '~/utils'

type Props = {
	route: string
}

const routes = [
	{
		name: 'Overview',
		path: ''
	},
	{
		name: 'Runs',
		path: 'runs'
	},
	{
		name: 'Tokens',
		path: 'tokens'
	}
]

export default function ChartsLinks({route}: Props) {
	return (
		<div className='flex justify-center gap-2 pb-2'>
			{routes.map((page, index) => (
				<div
					key={index}
					className='group relative flex flex-col items-center pb-2 text-sm font-medium'>
					<Link
						prefetch={false}
						className={cn(
							'mb-1 rounded-sm border border-slate-500 border-opacity-50 bg-slate-600 bg-opacity-50 px-2.5 py-0.5 hover:border-purple-300 hover:bg-purple-400 hover:bg-opacity-50',
							{'border border-purple-400 bg-purple-500': route == page.path}
						)}
						href={`/dashboard/usage/${page.path}`}>
						{page.name}
					</Link>
				</div>
			))}
		</div>
	)
}
