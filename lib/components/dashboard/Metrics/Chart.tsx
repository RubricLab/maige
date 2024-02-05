'use client'

import {LineChart} from '@tremor/react'

export type Category = {
	color: string
	value: string
	payload: {
		day: string
	}
	dataKey: string
}

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
			<div className='border-tertiary bg-primary w-fit rounded-sm border p-2 px-3 shadow-lg'>
				{payload.map((category: Category, idx: number) => (
					<div
						key={idx}
						className='flex flex-1 space-x-2.5'>
						<div
							className={`flex w-0.5 flex-col bg-${category.color}-500 rounded-sm`}
						/>
						<div>
							<p className='text-primary capitalize'>{category.dataKey}</p>
							<p className='text-secondary font-semibold'>
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
