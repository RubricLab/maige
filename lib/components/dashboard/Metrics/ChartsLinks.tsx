import Link from 'next/link'
import {buttonVariants} from '~/components/ui/button'
import {cn} from '~/utils'

type Props = {
	teamSlug: string
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

export function ChartsLinks({teamSlug, route}: Props) {
	return (
		<div className='flex justify-start gap-2 pb-2'>
			{routes.map((page, index) => (
				<div
					key={index}
					className='group relative flex flex-col items-center pb-2 text-sm font-medium'>
					<Link
						prefetch={false}
						className={cn(
							buttonVariants({variant: 'outline', size: 'sm'}),
							route === page.path ? 'bg-tertiary' : ''
						)}
						href={`/${teamSlug}/usage/${page.path}`}>
						{page.name}
					</Link>
				</div>
			))}
		</div>
	)
}
