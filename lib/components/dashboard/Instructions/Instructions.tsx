'use client'

import {type Instruction} from '@prisma/client'
import React from 'react'
import {cn} from '~/utils'
import CreateInstruction from './CreateInstruction'
import InstructionCard from './InstructionCard'

export function Instructions({
	instructions,
	teamSlug,
	projectId
}: {
	instructions: Instruction[]
	teamSlug: string
	projectId: string
}) {
	return (
		<div className='flex flex-col gap-4'>
			<CreateInstruction projectId={projectId} />
			<div className='flex flex-col gap-4'>
				{instructions.map((instruction, i) => (
					<React.Fragment key={instruction.id}>
						<InstructionCard
							teamSlug={teamSlug}
							instruction={instruction}
							index={i}
							key={instruction.id}
						/>
						<div
							key={instruction.id}
							className={cn(
								'h-0.5 w-full max-w-xl bg-gray-900',
								i + 1 === instructions.length && 'hidden'
							)}></div>
					</React.Fragment>
				))}
			</div>
		</div>
	)
}
