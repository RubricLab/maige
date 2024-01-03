'use client'

import {type Instruction} from '@prisma/client'
import {PenSquare} from 'lucide-react'
import Link from 'next/link'
import {useState} from 'react'
import {toast} from 'sonner'
import { buttonVariants } from '~/components/ui/button'
import {updateInstruction} from '~/actions/instructions'
import {PrimaryButton, SecondaryButton} from '../Buttons'
import {TextArea} from '../Input'
import {MediumBody, SmallHeading, Subtext} from '../Text'
import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import { cn } from '~/utils'
import { Button } from '~/components/ui/button'

export function Instructions({instructions}: {instructions: Instruction[]}) {
	return (
		<div className='flex flex-col items-center gap-8 w-full'>
			<div className='text-2xl'>Custom Instructions</div>
			{instructions.map((instruction, i) => (
				<>
				<Instruction
					instruction={instruction}
					index={i}
					key={instruction.id}
				/>
				<div className={cn('w-full bg-zinc-900 max-w-2xl h-0.5', i+1 === instructions.length && "hidden")}></div>
				</>
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
		<div className='bg-panel border-panel-border flex flex-col gap-4 rounded-lg border-2 p-8 w-full max-w-2xl'>
			<div className='flex justify-between items-center'>
				<div className='rounded-sm text bg-zinc-800 text-zinc-500 px-2.5 justify-center items-center flex'>{index+1}</div>
				<Subtext>
					<Link
						href={instruction.githubCommentLink}
						target='_blank'
						className='bg-zinc-800 px-2.5 py-0.5 rounded-sm inline-flex items-center gap-0.5'>
						{instruction.creatorUsername}
						<ArrowTopRightIcon/>
					</Link>
				</Subtext>
			</div>
			{!isEditing && (
				<div className='flex flex-col gap-2'>
					<MediumBody>&quot;{content}&quot;</MediumBody>
					<div
						className='cursor-pointer flex justify-end w-full'
						onClick={() => setIsEditing(true)}>
						<Button size='sm' variant='outline' className='inline-flex gap-2'>Edit <PenSquare width={16} /></Button>
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
					<Button size='sm' variant='outline'
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
