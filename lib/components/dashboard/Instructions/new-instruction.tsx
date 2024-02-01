import {useState} from 'react'
import createInstruction from '~/actions/create-instruction'
import {Button} from '~/components/ui/button'
import {Popover, PopoverContent, PopoverTrigger} from '~/components/ui/popover'
import {Textarea} from '~/components/ui/textarea'

type Props = {
	teamSlug: string
	projectId: string
}

export default function NewInstruction({teamSlug, projectId}: Props) {
	const [content, setContent] = useState('')

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant='outline'>Create Instruction</Button>
			</PopoverTrigger>
			<PopoverContent className='w-96 border-0 bg-black bg-opacity-70'>
				<div className='flex w-full flex-col gap-2'>
					<Textarea
						className='h-24'
						value={content}
						placeholder='maige ....'
						onChange={e => setContent(e.target.value)}
					/>
					<Button
						onClick={() => {
							setContent(''), createInstruction(teamSlug, projectId, content)
						}}
						size='sm'
						variant='outline'
						className='ml-auto w-fit'>
						Add
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	)
}