'use client'

import {type Instruction} from '@prisma/client'
import InstructionCard from './InstructionCard'

export function Instructions({
	instructions,
	teamSlug
}: {
	instructions: Instruction[]
	teamSlug: string
}) {
	return (
		<div className='flex flex-col gap-4'>
			{instructions.map((instruction, i) => (
				<InstructionCard
					teamSlug={teamSlug}
					instruction={instruction}
					index={i}
					key={instruction.id}
				/>
			))}
		</div>
	)
}
