'use client'

import {type Instruction} from '@prisma/client'
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
	return (
		<div className='grid grid-cols-3 gap-4'>
			<CreateInstruction projectId={projectId} />
			{instructions.map((instruction, i) => (
				<InstructionCard
					instruction={instruction}
					teamSlug={teamSlug}
					key={instruction.id}
				/>
			))}
		</div>
	)
}
