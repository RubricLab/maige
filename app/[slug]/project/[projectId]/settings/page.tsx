import {TrashIcon} from 'lucide-react'
import {Button} from '~/components/ui/button'

export default function Settings() {
	return (
		<div className='flex h-full w-full flex-col gap-4'>
			<h3>Settings</h3>
			<Button
				variant='destructive'
				className='w-fit'>
				Delete project <TrashIcon className='h-4 w-4' />
			</Button>
		</div>
	)
}
