'use client'

import {toast} from 'sonner'
import {Button} from '~/components/ui/button'

export default function Billing() {
	return (
		<div className='flex flex-col gap-4'>
			<h3>Billing</h3>
			<Button
				className='w-fit'
				variant='outline'
				onClick={() => toast.info('Coming soon')}>
				Upgrade to Pro
			</Button>
		</div>
	)
}
