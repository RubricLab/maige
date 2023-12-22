'use client'

import {Instruction} from '@prisma/client'
import {PenSquare} from 'lucide-react'
import Link from 'next/link'
import {useState} from 'react'
import {toast} from 'sonner'
import {updateInstruction} from '~/actions/instructions'
import {PrimaryButton, SecondaryButton} from '../Buttons'
import {TextArea} from '../Input'
import {MediumBody, SmallHeading, Subtext} from '../Text'

export function Instructions({instructions}: {instructions: Instruction[]}) {
	return (
		<div className='flex flex-col items-center gap-8'>
			{instructions.map((instruction, i) => (
				<Instruction
					instruction={instruction}
					index={i}
					key={instruction.id}
				/>
			))}
		</div>
	)
}

function Instruction({
	instruction,
	index
}: {
	instruction: Instruction
	index: number
}) {
	const [isEditing, setIsEditing] = useState(false)
	const [submitLoading, setSubmitLoading] = useState(false)
	const [content, setContent] = useState(instruction.content)

	return (
		<div className='bg-panel border-panel-border flex w-[400px] flex-col gap-4 rounded-lg border-2 p-8'>
			<div>
				<SmallHeading>Instruction #{index}</SmallHeading>
				<Subtext>
					<Link
						href={instruction.githubCommentLink}
						target='_blank'
						className='underline'>
						Created by {instruction.creatorUsername}
					</Link>
				</Subtext>
			</div>
			{!isEditing && (
				<div>
					<MediumBody>{content}</MediumBody>
					<div
						className='cursor-pointer'
						onClick={() => setIsEditing(true)}>
						<PenSquare width={16} />
					</div>
				</div>
			)}

			{isEditing && (
				<TextArea
					value={content}
					onTextChange={setContent}
				/>
			)}
			{isEditing && (
				<div className='flex flex-row items-center justify-between'>
					<SecondaryButton
						onClick={() => {
							setContent(instruction.content)
							setIsEditing(false)
						}}>
						Cancel
					</SecondaryButton>
					<PrimaryButton
						loading={submitLoading}
						onClick={async () => {
							setSubmitLoading(true)
							const success = await updateInstruction(instruction.id, content)
							setSubmitLoading(false)
							if (success) {
								setContent(content) // optimistically update state variable
								setIsEditing(false)
								toast.info('Instruction updated')
							} else toast.error('Error updating instruction')
						}}>
						Save
					</PrimaryButton>
				</div>
			)}
		</div>
	)
}
