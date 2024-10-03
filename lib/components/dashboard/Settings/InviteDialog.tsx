'use client'

import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { buttonVariants } from '~/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import InviteForm from './InviteForm'

export default function InviteDialog({ teamId }: { teamId: string }) {
	const [open, setOpen] = useState(false)
	return (
		<Dialog open={open} onOpenChange={() => setOpen(prev => !prev)}>
			<DialogTrigger className={buttonVariants({ variant: 'outline' })}>
				<PlusIcon className="h-4 w-4" />
				Invite member
			</DialogTrigger>
			<DialogContent>
				<InviteForm teamId={teamId} setDialogOpen={setOpen} />
			</DialogContent>
		</Dialog>
	)
}
