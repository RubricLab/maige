'use client'
import {MessageCircle, XIcon} from 'lucide-react'
import {useState} from 'react'
import {toast} from 'sonner'
import {Popover, PopoverContent, PopoverTrigger} from '~/components/ui/popover'
import {Button} from '../ui/button'
import {Textarea} from '../ui/textarea'
import {submitFeedback} from './actions'

type Props = {}

export default function Feedback({}: Props) {
	const [content, setContent] = useState('')
	const [openModal, setOpenModal] = useState(false)

	function sendFeedback(content: string) {
		setOpenModal(false)
		const promise = submitFeedback(content)
		setContent('')
		toast.promise(promise, {
			loading: 'Loading...',
			success: () => {
				return `Feedback successfully sent!`
			},
			error: 'Oops, something went wrong!'
		})
	}

	return (
		<div
			onClick={() => setOpenModal(!openModal)}
			className='fixed bottom-0 right-0 z-10 m-5 flex cursor-pointer items-center justify-center rounded-full border border-white p-2.5 shadow-sm'>
			<Popover
				open={openModal}
				onOpenChange={() => setContent('')}>
				<PopoverTrigger
					asChild
					className='focus-visible:outline-none'>
					{!openModal ? (
						<button onClick={() => setOpenModal(true)}>
							<MessageCircle className='h-5 w-5 text-white' />
						</button>
					) : (
						<button onClick={() => setOpenModal(false)}>
							<XIcon className='h-5 w-5 text-white' />
						</button>
					)}
				</PopoverTrigger>
				<PopoverContent className='mb-7 mr-6 w-[235px]'>
					<div className='flex flex-col gap-2'>
						<div className='w-full border-b border-b-accent pb-2 text-sm font-semibold text-slate-400'>
							Send Us Some Feedback!
						</div>
						<div className='flex w-full flex-col gap-2'>
							<Textarea
								className='h-24 w-full cursor-text border-none p-0 text-slate-400 placeholder:opacity-50'
								value={content}
								placeholder='I wish that ...'
								onChange={e => setContent(e.target.value)}
							/>
							<Button
								onClick={() => {
									sendFeedback(content)
								}}
								size='sm'
								className='h-7 px-2 py-0 text-xs'>
								Send!
							</Button>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}
