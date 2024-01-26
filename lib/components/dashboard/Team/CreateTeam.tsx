import {PlusIcon} from 'lucide-react'
import {createTeam} from '~/actions/team'
import {Button} from '~/components/ui/button'
import {CommandItem} from '~/components/ui/command'
import {Dialog, DialogContent, DialogTrigger} from '~/components/ui/dialog'
import {Input} from '~/components/ui/input'

export default function CreateTeam() {
	return (
		<Dialog>
			<DialogTrigger className='w-full'>
				<CommandItem className='flex h-full w-full items-center justify-between'>
					Create team <PlusIcon className='h-4 w-4' />
				</CommandItem>
			</DialogTrigger>
			<DialogContent>
				<div className='flex w-full flex-col gap-4'>
					<h3>Create Team</h3>
					<form
						className='flex flex-col gap-4'
						action={createTeam}>
						<Input placeholder='Enter name...' />
						<div className='flex w-full items-center justify-end'>
							<Button className='w-fit'>Create</Button>
						</div>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	)
}
