import {TrashIcon} from 'lucide-react'
import {Button} from '~/components/ui/button'

export default function Settings() {
	return (
		<div>
			<h1>Settings</h1>
			<Button variant='destructive'>
				Delete <TrashIcon />
			</Button>
		</div>
	)
}
