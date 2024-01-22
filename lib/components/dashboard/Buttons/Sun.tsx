'use client'
import {signIn} from 'next-auth/react'
import {Button} from '~/components/ui/button'
import {cn} from '~/utils'

export const Sun = ({className}: {className?: string}) => {
	return (
		<Button
			onClick={() => signIn('github', {callbackUrl: '/dashboard'})}
			className={cn(
				className,
				'center group h-8 w-8 rounded-full border border-red-700 bg-gradient-to-t from-red-700 to-orange-500 drop-shadow-glow transition-all hover:w-32 dark:hover:from-black'
			)}>
			<span className='whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100'>
				Log in
			</span>
		</Button>
	)
}
