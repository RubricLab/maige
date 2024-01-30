'use client'

import {type Instruction} from '@prisma/client'
import {PlusIcon} from 'lucide-react'
import {useSession} from 'next-auth/react'
import createInstruction from '~/actions/create-instruction'
import CreateInstruction from './CreateInstruction'
import InstructionCard from './InstructionCard'

export function Instructions({
	instructions,
	projectId,
	teamSlug
}: {
	instructions: Instruction[]
	projectId: string
	teamSlug: string
}) {
	const session = useSession()
	const userName = session.data?.user?.name || '@username'

	const examples = [
		'Label all new issues',
		`Assign ${userName} when a UI-related issue is opened`,
		'Recommend a solution when a question is asked',
		'[beta] dispatch an engineer to resolve incoming issues'
	]

	return (
		<div className='grid grid-cols-2 gap-16'>
			<div className='flex flex-col gap-4'>
				<CreateInstruction projectId={projectId} />
				{instructions.map(instruction => (
					<InstructionCard
						instruction={instruction}
						teamSlug={teamSlug}
						key={instruction.id}
					/>
				))}
			</div>
			<div className='text-tertiary flex flex-col gap-4 p-4'>
				<h3>Examples</h3>
				{examples.map((example, i) => (
					<div
						key={i}
						className={`hover:bg-tertiary flex cursor-pointer items-center gap-2 rounded-sm p-2`}
						onClick={() => {
							let data = new FormData()
							data.append('projectId', projectId)
							data.append('content', example)
							createInstruction(undefined, data)
						}}>
						<PlusIcon className='h-5 w-5' />
						{example}
					</div>
				))}
			</div>
		</div>
	)
}
