'use client'

import {TrashIcon} from 'lucide-react'
import {toast} from 'sonner'
import {Button} from '~/components/ui/button'

export default function DeleteTeam() {
	return (
		<Button
			className='w-fit'
			variant='destructive'
			onClick={() => toast.info('Coming soon')}>
			<TrashIcon className='h-4 w-4' />
			Delete team
		</Button>
	)
}
