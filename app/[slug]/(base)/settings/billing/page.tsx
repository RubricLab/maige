import Link from 'next/link'
import {UpgradeForm} from '~/components/dashboard/Billing/UpgradeForm'
import {Button} from '~/components/ui/button'
import {STRIPE} from '~/constants'
import prisma from '~/prisma'
import {getCurrentUser} from '~/utils/session'

function ManageButton() {
	return (
		<Link
			target='_blank'
			className='w-fit'
			href={STRIPE.MANAGE_LINK}>
			<Button variant='outline'>Manage Subscription</Button>
		</Link>
	)
}

export default async function Billing() {
	const {id} = await getCurrentUser()
	const user = await prisma.user.findUnique({
		where: {id},
		select: {stripeCustomerId: true}
	})

	return (
		<div className='flex flex-col gap-4'>
			<h3>Billing</h3>
			{user.stripeCustomerId ? <ManageButton /> : <UpgradeForm />}
		</div>
	)
}
