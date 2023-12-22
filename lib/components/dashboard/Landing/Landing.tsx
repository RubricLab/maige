'use client'

import {Github} from 'lucide-react'
import {signIn} from 'next-auth/react'
import {PrimaryButton} from '../Buttons'

export function Landing() {
	return (
		<div className='flex h-screen w-full items-center justify-center'>
			<PrimaryButton onClick={() => signIn('github', {callbackUrl: '/dashboard'})}>
				<Github className='mr-2 inline' />
				Sign in
			</PrimaryButton>
		</div>
	)
}
