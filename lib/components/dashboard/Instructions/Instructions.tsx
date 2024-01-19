'use client'

import {type Instruction} from '@prisma/client'
import {ArrowTopRightIcon} from '@radix-ui/react-icons'
import {deleteInstruction} from 'app/dashboard/repo/[projectId]/instructions/actions'
import {PenSquare, XIcon} from 'lucide-react'
import Link from 'next/link'
import React, {useCallback, useState} from 'react'
import {toast} from 'sonner'
import {updateInstruction} from '~/actions/instructions'
import {Button, buttonVariants} from '~/components/ui/button'
import {cn} from '~/utils'
import {PrimaryButton} from '../Buttons'
import {TextArea} from '../Input'
import {MediumBody, Subtext} from '../Text'
import NewInstruction from './new-instruction'

export function Instructions({
	instructions,
	projectId
}: {
	instructions: Instruction[]
	projectId: string
}) {
	return (
		<div className='relative flex w-full flex-col items-center space-y-4 pb-10'>
			{instructions.map((instruction, i) => (
				<React.Fragment key={instruction.id}>
					<Instruction
						instruction={instruction}
						index={i}
						key={instruction.id}
					/>
					<div
						key={instruction.id}
						className={cn(
							'h-0.5 w-full max-w-xl bg-gray-900',
							i + 1 === instructions.length && 'hidden'
						)}></div>
				</React.Fragment>
			))}
			<div className='fixed bottom-0 left-0 right-0 mx-auto w-fit pb-10'>
				{projectId && <NewInstruction projectId={projectId} />}
			</div>
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
				'group relative flex w-full max-w-xl flex-col gap-4 rounded-lg border-2 bg-primary p-8 opacity-100 transition-opacity duration-200',
				{'pointer-events-none opacity-50': isDelete}
			)}>
			{!isDelete && (
				<button
					onClick={() => {
						setDelete(true)
						deleteInstruction(instruction.projectId, instruction.id)
					}}
					className='absolute -right-3 -top-3 hidden rounded-lg bg-red-500 p-1 opacity-0 transition-opacity duration-200 ease-in-out group-hover:block group-hover:opacity-100'>
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
				<Subtext>
					{instruction.githubCommentLink ? (
						<Link
							href={instruction.githubCommentLink}
							target='_blank'
							className='inline-flex items-center gap-0.5 rounded-sm bg-gray-800 px-2.5 py-0.5'>
							{instruction.creatorUsername}
							<ArrowTopRightIcon />
						</Link>
					) : (
						<span className='inline-flex items-center gap-0.5 rounded-sm bg-gray-800 px-2.5 py-0.5'>
							{instruction.creatorUsername}
						</span>
					)}
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
						onClick={handleCancel}>
						Cancel
					</Button>
					<PrimaryButton
						className={buttonVariants({size: 'sm'})}
						loading={submitLoading}
						onClick={handleSave}>
						Save
					</PrimaryButton>
				</div>
			)}
		</div>
	)
}
