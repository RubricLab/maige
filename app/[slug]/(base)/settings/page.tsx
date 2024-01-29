import {TrashIcon} from 'lucide-react'
import {Button} from '~/components/ui/button'

export default function Settings() {
	return (
		<div className='flex h-full w-full flex-col gap-4'>
			<h3>Settings</h3>
			<Button
				className='w-fit'
				variant='destructive'>
				Delete team <TrashIcon className='h-4 w-4' />
			</Button>
		</div>
	)
}
