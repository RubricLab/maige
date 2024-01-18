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
                        className='relative flex flex-col items-center pb-2 group font-medium text-sm'>
                        <Link
                            prefetch={false}
                            className={cn('mb-1 rounded-sm px-2.5 py-0.5 bg-slate-600 border border-slate-500 border-opacity-50 bg-opacity-50 hover:bg-purple-400 hover:bg-opacity-50 hover:border-purple-300', {"bg-purple-500 border border-purple-400" : route == page.path})}
                            href={`/dashboard/usage/${page.path}`}>
                            {page.name}
                        </Link>
                    </div>
                ))
            }
		</div>
	)
}
