'use client'

import {PlusIcon} from 'lucide-react'
import {Dispatch, SetStateAction, useEffect, useState} from 'react'

const templates = [
	'Label all new issues',
	'Assign @milton when a UI-related issue is opened',
	'Recommend a solution when a question is asked',
	'[beta] dispatch an engineer to resolve incoming issues'
]

function Template({template, setContent}) {
	const [selected, setSelected] = useState(false)

	useEffect(() => {
		if (selected) setTimeout(() => setSelected(false), 1 * 1000)
	}, [selected])

	return (
		<div
			className={`hover:bg-tertiary border-tertiary flex cursor-pointer items-center gap-2 rounded-sm border p-2 ${selected ? 'bg-tertiary' : ''}`}
			onClick={() => {
				setSelected(prev => !prev)
				setContent(template)
			}}>
			<PlusIcon className='h-5 w-5' />
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
		<div className='text-secondary flex w-full flex-col gap-2'>
			<h3>Examples</h3>
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
