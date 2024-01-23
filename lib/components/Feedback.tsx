'use client'

import {MessageSquareMoreIcon} from 'lucide-react'
import {useState} from 'react'
import {toast} from 'sonner'
import {submitFeedback} from '~/actions/feedback'
import {Button} from './ui/button'
import {Dialog, DialogContent, DialogTrigger} from './ui/dialog'
import {Textarea} from './ui/textarea'

type Props = {}

export default function Feedback({}: Props) {
	const [content, setContent] = useState('')
	const [openDialog, setOpenDialog] = useState(false)

	function sendFeedback(content: string) {
		setOpenDialog(false)
		const promise = submitFeedback(content)
		setContent('')
		toast.promise(promise, {
			loading: 'Submitting...',
			success: () => {
				return `Feedback submitted`
			},
			error: 'Oops, something went wrong.'
		})
	}
	return (
		<Dialog
			open={openDialog}
			onOpenChange={() => setOpenDialog(prev => !prev)}>
			<DialogTrigger>
				{/* Making this a button throws a button-in-button HTML error */}
				<div className='center hover:bg-tertiary h-9 w-9 rounded-sm transition-colors'>
					<MessageSquareMoreIcon className='h-4 w-4' />
				</div>
			</DialogTrigger>
			<DialogContent>
				<div className='flex w-full flex-col gap-4'>
					<h3>Submit feedback</h3>
					<Textarea
						contentEditable
						maxLength={190}
						className='h-32 max-h-48'
						value={content}
						placeholder='I wish that ...'
						onChange={e => setContent(e.target.value)}
					/>
					<div className='flex w-full items-center justify-end gap-4'>
						<span
							className={`${content.length === 0 ? 'opacity-0' : 'opacity-100'} text-xs text-opacity-50 transition-opacity duration-300`}>
							{content.length}
						</span>
						<Button
							className='w-fit'
							onClick={() => sendFeedback(content)}>
							Submit
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
