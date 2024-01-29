'use client'

import {Dispatch, SetStateAction, useEffect, useState} from 'react'

const templates = [
	'Label all news issues',
	'Assign @elonmusk when an issue is created regarding frontend changes',
	'Recommend a solution when a question is asked',
	'Maige beta dispatch an engineer to resolve incoming issues'
]

function Template({template, setContent}) {
	const [selected, setSelected] = useState(false)

	useEffect(() => {
		if (selected) setTimeout(() => setSelected(false), 1 * 1000)
	}, [selected])

	return (
		<div
			className={`hover:bg-tertiary border-tertiary cursor-pointer rounded-sm border p-2 ${selected ? 'bg-tertiary' : ''}`}
			onClick={() => {
				setSelected(prev => !prev)
				setContent(template)
			}}>
			{template}
		</div>
	)
}

export default function InstructionTemplates({
	setContent
}: {
	setContent: Dispatch<SetStateAction<string>>
}) {
	return (
		<div className='flex w-full flex-col gap-2'>
			<h3>Templates</h3>
			{templates.map((template, i) => (
				<Template
					key={i}
					template={template}
					setContent={setContent}
				/>
			))}
		</div>
	)
}
