'use client'

import {Github} from 'lucide-react'
import {signIn} from 'next-auth/react'
import {Button} from '~/components/ui/button'

export function Landing() {
	return (
		<div className='flex h-screen w-full items-center justify-center bg-black'>
			<div className='flex w-full max-w-xs flex-col items-center justify-center gap-3'>
				<span className='text-sm'>Let&apos;s get started!</span>
				<Button
					className='w-full py-5'
					variant='default'
					onClick={() => signIn('github', {callbackUrl: '/dashboard'})}>
					<Github className='mr-2 inline' />
					Sign in
				</Button>
			</div>
		</div>
	)
}
