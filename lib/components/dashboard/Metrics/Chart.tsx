'use client'

import { LineChart } from '@tremor/react'

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
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	data: any
	category: string
	color: string
}) {
	const customTooltip = ({
		payload,
		active
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	}: { payload: any; active: any }) => {
		if (!active || !payload) return null

		return (
			<div className="w-fit rounded-sm border border-tertiary bg-primary p-2 px-3 shadow-lg">
				{payload.map((category: Category, idx: number) => (
					<div key={idx} className="flex flex-1 space-x-2.5">
						<div className={`flex w-0.5 flex-col bg-${category.color}-500 rounded-sm`} />
						<div>
							<p className="text-primary capitalize">{category.dataKey}</p>
							<p className="font-semibold text-secondary">
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
			className="h-72 w-full"
			data={data}
			index="date"
			showAnimation={true}
			showLegend={false}
			categories={[category]}
			customTooltip={customTooltip}
			colors={[color]}
			yAxisWidth={40}
		/>
	)
}
