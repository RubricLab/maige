'use client'

import {Instruction} from '@prisma/client'
import {ArrowUpRightIcon, PenSquare, XIcon} from 'lucide-react'
import Link from 'next/link'
import {useCallback, useState} from 'react'
import {toast} from 'sonner'
import deleteInstruction from '~/actions/delete-instruction'
import {updateInstruction} from '~/actions/update-instruction'
import {Button} from '~/components/ui/button'
import {cn} from '~/utils'
import {TextArea} from '../Input'

export default function InstructionCard({
	teamSlug,
	instruction,
	index
}: {
	teamSlug: string
	instruction: Instruction
	index: number
}) {
	const [isEditing, setIsEditing] = useState(false)
	const [submitLoading, setSubmitLoading] = useState(false)
	const [content, setContent] = useState(instruction.content)
	const [isDelete, setDelete] = useState(false)

	const handleSave = useCallback(async () => {
		setSubmitLoading(true)

		const success = await updateInstruction(instruction.id, content)

		setSubmitLoading(false)

		if (success) {
			setContent(content) // optimistically update state variable
			setIsEditing(false)

			toast.info('Instruction updated')
		} else toast.error('Error updating instruction')
	}, [content, instruction.id])

	const handleCancel = useCallback(() => {
		setContent(instruction.content)
		setIsEditing(false)
	}, [instruction.content])

	return (
		<div
			id={instruction.id}
			className={cn(
				'bg-primary group relative flex w-full max-w-xl flex-col gap-4 rounded-sm border p-6 opacity-100 transition-opacity duration-200',
				{'pointer-events-none opacity-50': isDelete}
			)}>
			{!isDelete && (
				<button
					onClick={() => {
						setDelete(true)
						deleteInstruction(teamSlug, instruction.projectId, instruction.id)
					}}
					className='absolute -right-3 -top-3 hidden rounded-sm bg-red-500 p-1 opacity-0 transition-opacity duration-200 ease-in-out group-hover:block group-hover:opacity-100'>
					<XIcon
						size={15}
						strokeWidth={3}
					/>
				</button>
			)}
			<div className='flex items-center justify-between'>
				<div className='text flex items-center justify-center rounded-sm bg-gray-800 px-2.5 text-gray-500'>
					{index + 1}
				</div>
				<p>
					{instruction.githubCommentLink ? (
						<Link
							href={instruction.githubCommentLink}
							target='_blank'
							className='inline-flex items-center gap-0.5 rounded-sm bg-gray-800 px-2.5 py-0.5'>
							{instruction.creatorUsername}
							<ArrowUpRightIcon />
						</Link>
					) : (
						<span className='inline-flex items-center gap-0.5 rounded-sm bg-gray-800 px-2.5 py-0.5'>
							{instruction.creatorUsername}
						</span>
					)}
				</p>
			</div>
			{!isEditing && (
				<div className='flex flex-col gap-2'>
					<p>&quot;{content}&quot;</p>
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
						onClick={handleCancel}>
						Cancel
					</Button>
					<Button
						size='sm'
						disabled={submitLoading}
						onClick={handleSave}>
						Save
					</Button>
				</div>
			)}
		</div>
	)
}
