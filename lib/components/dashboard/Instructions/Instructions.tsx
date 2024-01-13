'use client'

import {type Instruction} from '@prisma/client'
import {ArrowTopRightIcon} from '@radix-ui/react-icons'
import {PenSquare} from 'lucide-react'
import Link from 'next/link'
import {useState} from 'react'
import {toast} from 'sonner'
import {updateInstruction} from '~/actions/instructions'
import {Button, buttonVariants} from '~/components/ui/button'
import {cn} from '~/utils'
import {PrimaryButton} from '../Buttons'
import {TextArea} from '../Input'
import {MediumBody, Subtext} from '../Text'

export function Instructions({instructions}: {instructions: Instruction[]}) {
	return (
		<>
			{instructions.map((instruction, i) => (
				<>
					<Instruction
						instruction={instruction}
						index={i}
						key={instruction.id}
					/>
					<div
						className={cn(
							'h-0.5 w-full max-w-2xl bg-zinc-900',
							i + 1 === instructions.length && 'hidden'
						)}></div>
				</>
			))}
		</>
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
		<div className='flex w-full max-w-2xl flex-col gap-4 rounded-lg border-2 border-panel-border bg-panel p-8'>
			<div className='flex items-center justify-between'>
				<div className='text flex items-center justify-center rounded-sm bg-zinc-800 px-2.5 text-zinc-500'>
					{index + 1}
				</div>
				<Subtext>
					<Link
						href={instruction.githubCommentLink}
						target='_blank'
						className='inline-flex items-center gap-0.5 rounded-sm bg-zinc-800 px-2.5 py-0.5'>
						{instruction.creatorUsername}
						<ArrowTopRightIcon />
					</Link>
				</Subtext>
			</div>
			{!isEditing && (
				<div className='flex flex-col gap-2'>
					<MediumBody>&quot;{content}&quot;</MediumBody>
					<div
						className='flex w-full cursor-pointer justify-end'
						onClick={() => setIsEditing(true)}>
						<Button
							size='sm'
							variant='outline'
							className='inline-flex gap-2'>
							Edit <PenSquare width={16} />
						</Button>
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
					<Button
						size='sm'
						variant='outline'
						onClick={() => {
							setContent(instruction.content)
							setIsEditing(false)
						}}>
						Cancel
					</Button>
					<PrimaryButton
						className={buttonVariants({size: 'sm'})}
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
