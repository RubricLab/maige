import Link from 'next/link'
import { cn } from '~/utils'

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
	},
]

export default function ChartsLinks({route}: Props) {
	return (
		<div className='flex gap-2 pb-2 justify-center'>
            {
                routes.map((page, index) => (
                    <div
                        key={index}
                        className='relative flex flex-col items-center pb-2 group'>
                        <Link
                            prefetch={false}
                            className='mb-1 rounded-sm px-2.5 py-0.5 hover:bg-white hover:bg-opacity-20'
                            href={`/dashboard/usage/${page.path}`}>
                            {page.name}
                        </Link>
                        <div
                            className={cn(
                                'invisible w-[90%] border-b-[2px] group-hover:visible border-b-white border-opacity-50',
                                route == `${page.path}` && 'visible border-opacity-100'
                            )}></div>
                    </div>
                ))
            }
		</div>
	)
}
