'use client'
import { MessageSquareMoreIcon } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import FeedbackForm from './FeedbackForm'

export default function FeedbackDialog() {
	const [open, setOpen] = useState(false)

	return (
		<Dialog open={open} onOpenChange={() => setOpen(prev => !prev)}>
			<DialogTrigger>
				{/* Making this a button throws a button-in-button HTML error */}
				<div className="center h-9 w-9 rounded-sm transition-colors hover:bg-tertiary">
					<MessageSquareMoreIcon className="h-4 w-4" />
				</div>
			</DialogTrigger>
			<DialogContent>
				<FeedbackForm setDialogOpen={setOpen} />
			</DialogContent>
		</Dialog>
	)
}
