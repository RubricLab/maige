import Link from 'next/link'
import {buttonVariants} from '~/components/ui/button'
import {cn} from '~/utils'

type Props = {
	teamSlug: string
	route: string
}

const routes = [
	{
		name: 'Logs',
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

export function ChartsLinks({teamSlug, route}: Props) {
	return (
		<div className='flex items-center justify-between gap-2 pb-2'>
			<div className='inline-flex gap-2'>
				{routes.map((page, index) => (
					<div
						key={index}
						className='group relative flex flex-col items-center pb-2 font-medium'>
						<Link
							prefetch={false}
							className={cn(
								buttonVariants({variant: 'outline'}),
								route === page.path ? 'bg-tertiary' : ''
							)}
							href={`/${teamSlug}/usage/${page.path}`}>
							{page.name}
						</Link>
					</div>
				))}
			</div>
			<div className='font-mono text-xs capitalize'>
				Aggregated {route == '' ? 'logs' : route} Data of All Projects
			</div>
		</div>
	)
}
