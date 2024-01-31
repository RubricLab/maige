'use client'

import {PlusIcon} from 'lucide-react'
import {useSession} from 'next-auth/react'
import {Dispatch, SetStateAction, useEffect, useState} from 'react'

function Template({title, content, setContent}) {
	const [selected, setSelected] = useState(false)

	useEffect(() => {
		if (selected) setTimeout(() => setSelected(false), 1 * 1000)
	}, [selected])

	return (
		<div
			className={`hover:bg-tertiary border-tertiary flex cursor-pointer items-center gap-2 rounded-sm border p-2 ${selected ? 'bg-tertiary' : ''}`}
			onClick={() => {
				setSelected(prev => !prev)
				setContent(content)
			}}>
			<PlusIcon className='h-5 w-5' />
			{title}
		</div>
	)
}

export default function InstructionTemplates({
	setContent
}: {
	setContent: Dispatch<SetStateAction<string>>
}) {
	const {
		data: {
			user: {name: userName}
		}
	} = useSession()

	const templates = [
		{
			title: 'Label issues',
			content: 'Label all incoming issues'
		},
		{
			title: 'Assign issues',
			content: `Assign @${userName || 'username'} when a UI-related issue is opened`
		},
		{
			title: 'Recommend solutions',
			content: 'Comment a suggested solution to incoming issues'
		},
		{
			title: 'Code Generation [beta]',
			content: 'Dispatch an engineer to resolve incoming issues'
		}
	]

	return (
		<div className='text-secondary flex w-full flex-col gap-2'>
			<h3>Examples</h3>
			{templates.map(({title, content}, i) => (
				<Template
					key={i}
					title={title}
					content={content}
					setContent={setContent}
				/>
			))}
		</div>
	)
}
