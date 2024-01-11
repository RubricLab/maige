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
		<>
			<DropdownMenu>
				<DropdownMenuTrigger className='focus-visible:outline-none'>
                <DotsHorizontalIcon />
				</DropdownMenuTrigger>
				<DropdownMenuContent className='mr-28 w-[135px] z-10'>
                <DropdownMenuItem
						className='cursor-pointer'>
						View Runs
					</DropdownMenuItem>
                    <DropdownMenuItem
						className='cursor-pointer'>
						Something...
					</DropdownMenuItem>
					<DropdownMenuItem
						className='cursor-pointer hover:!bg-red-500 hover:!text-red-500 hover:!bg-opacity-25 text-red-500'>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}
