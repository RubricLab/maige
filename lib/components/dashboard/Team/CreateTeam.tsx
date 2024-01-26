import {PlusIcon} from 'lucide-react'

import {CommandItem} from '~/components/ui/command'
import {Dialog, DialogContent, DialogTrigger} from '~/components/ui/dialog'
import TeamForm from './TeamForm'

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
					<TeamForm />
				</div>
			</DialogContent>
		</Dialog>
	)
}
