import prisma from '~/prisma'
import CreateInstruction from './CreateInstruction'
import InstructionCard from './InstructionCard'

export async function Instructions({projectId}: {projectId: string}) {
	const instructions = await prisma.instruction.findMany({
		where: {
			projectId: projectId
		}
	})
	return (
		<div className='grid grid-cols-3 gap-4'>
			<CreateInstruction projectId={projectId} />
			{instructions.map(instruction => (
				<InstructionCard
					instruction={instruction}
					key={instruction.id}
				/>
			))}
		</div>
	)
}
