'use client'

import {Github} from 'lucide-react'
import {signIn} from 'next-auth/react'
import {Button} from '~/components/ui/button'

export function Auth() {
	return (
		<Button
			className='w-full py-5'
			variant='default'
			onClick={() => signIn('github', {callbackUrl: '/dashboard'})}>
			<Github className='mr-2 inline' />
			Add to your repo
		</Button>
	)
}
