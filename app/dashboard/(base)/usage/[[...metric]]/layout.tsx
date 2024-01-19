import {notFound} from 'next/navigation'
import z from 'zod'
import Charts from '~/components/dashboard/usage/charts'
import ChartsLinks from '~/components/dashboard/usage/charts-links'

const paramsSchema = z.enum(['runs', 'tokens'])

export default async function RootLayout({
	children,
	params
}: {
	children: React.ReactNode
	params: {
		metric: string[] | undefined
	}
}) {
	if (
		params.metric &&
		(params.metric.length > 1 ||
			!paramsSchema.safeParse(params?.metric[0]).success)
	)
		return notFound()

	const route = params.metric ? params.metric[0] : ''

	return (
		<div className='space-y-2'>
			<ChartsLinks route={route} />
			<div className='space-y-5'>
				<Charts route={route} />
				{children}
			</div>
		</div>
	)
}
