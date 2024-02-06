'use client'

import {User} from 'next-auth'
import {signIn} from 'next-auth/react'
import {useRouter} from 'next/navigation'
import {toast} from 'sonner'
import createMembership from '~/actions/create-membership'

export default function AcceptInvite({
	user,
	inviteId,
	teamSlug
}: {
	user: User | null
	inviteId: string
	teamSlug: string
}) {
	const router = useRouter()

	async function acceptInvite(inviteId: string) {
		const state = await createMembership(inviteId)
		if (state?.type === 'success') {
			toast.success(state?.message)
			router.push(`/${teamSlug}`)
		} else if (state?.type === 'error') {
			toast.error(state?.message)
			console.error(state?.message)
		}
	}
	return (
		<button
			className='w-72 rounded-sm bg-green-700 p-3 text-xl font-medium text-white transition-all hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/60'
			onClick={() =>
				user
					? acceptInvite(inviteId)
					: signIn('github', {
							callbackUrl: window.location.href
						})
			}>
			{user ? 'Accept invite' : 'Log in to accept invite'}
		</button>
	)
}
