import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

type Props = {
    projectId: string
}

export default function RepositoryOptions({projectId}: Props) {
	return (
		<div>
			<DropdownMenu>
				<DropdownMenuTrigger className='focus-visible:outline-none'>
                <DotsHorizontalIcon />
				</DropdownMenuTrigger>
				<DropdownMenuContent className='mr-28 w-[135px]'>
                <DropdownMenuItem
						className='cursor-pointer'>
						View Runs
					</DropdownMenuItem>
                    <DropdownMenuItem
						className='cursor-pointer'>
						Something...
					</DropdownMenuItem>
					<DropdownMenuItem
						className='cursor-pointer'>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
