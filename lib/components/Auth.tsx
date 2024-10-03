'use client'

import { signIn } from 'next-auth/react'
import posthog from 'posthog-js'

export function Auth({ text }: { text?: string }) {
	return (
		<button
			type="button"
			className="w-72 rounded-sm bg-green-700 p-3 font-medium text-white text-xl transition-all hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/60"
			onClick={() => {
				signIn('github', { callbackUrl: '/' })
				posthog.capture('Sign in')
			}}
		>
			{text || 'Add to your repo'}
		</button>
	)
}
