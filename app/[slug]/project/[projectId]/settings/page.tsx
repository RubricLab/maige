import { TrashIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Button } from '~/components/ui/button'
import prisma from '~/prisma'
import { getCurrentUser } from '~/utils/session'

export default function Settings({
	params
}: {
	params: { slug: string; projectId: string }
}) {
	const handleDelete = async () => {
		'use server'

		const user = await getCurrentUser()
		await prisma.project.delete({
			where: {
				id: params.projectId,
				createdBy: user.id
			}
		})
		redirect(`/${params.slug}`)
	}

	return (
		<div className="flex h-full w-full flex-col gap-4">
			<h3>Settings</h3>
			<form action={handleDelete}>
				<Button variant="destructive" className="w-fit">
					<TrashIcon className="h-4 w-4" />
					Delete project
				</Button>
			</form>
		</div>
	)
}
