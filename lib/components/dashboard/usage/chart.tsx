import {LineChart} from '@tremor/react'

export function Chart({
	data,
	category,
	color
}: {
	data: any
	category: string
	color: string
}) {
	const customTooltip = ({payload, active}: {payload: any; active: any}) => {
		if (!active || !payload) return null

		return (
			<div className='w-56 rounded-tremor-default border border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown'>
				{payload.map((category: any, idx: number) => (
					<div
						key={idx}
						className='flex flex-1 space-x-2.5'>
						<div className={`flex w-1 flex-col bg-${category.color}-500 rounded`} />
						<div className='space-y-1'>
							<p className='text-tremor-content'>{category.dataKey}</p>
							<p className='font-medium text-tremor-content-emphasis'>
								{category.value} {category.payload.day}
							</p>
						</div>
					</div>
				))}
			</div>
		)
	}

	return (
		<LineChart
			className='h-72 w-full'
			data={data}
			index='date'
			showAnimation={true}
			showLegend={false}
			categories={[category]}
			customTooltip={customTooltip}
			colors={[color]}
			yAxisWidth={40}
		/>
	)
}
