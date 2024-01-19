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
		<div className='flex justify-start gap-2 pb-2'>
			{routes.map((page, index) => (
				<div
					key={index}
					className='group relative flex flex-col items-center pb-2 text-sm font-medium'>
					<Link
						prefetch={false}
						className={cn(
							'mb-1 rounded-sm border bg-gray-900 px-2.5 py-0.5 transition-colors hover:border-gray-700 hover:bg-gray-800',
							{'border-gray-700 bg-gray-800': route == page.path}
						)}
						href={`/dashboard/usage/${page.path}`}>
						{page.name}
					</Link>
				</div>
			))}
		</div>
	)
}
