'use client'

import {Github} from 'lucide-react'
import {signIn} from 'next-auth/react'
import { Button } from '~/components/ui/button'

export function Landing() {
	return (
		<div className='flex h-screen w-full items-center justify-center'>
			<div className='flex flex-col justify-center items-center gap-3 w-full max-w-xs'>
				<span className='text-sm'>Lets get Started!</span>
			<Button className="w-full py-5" variant='outline' onClick={() => signIn('github', {callbackUrl: '/dashboard'})}>
				<Github className='mr-2 inline' />
				Sign in
			</Button>
			</div>
		</div>
	)
}
