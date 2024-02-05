'use client'
import {User} from 'next-auth'
import {signIn} from 'next-auth/react'
import {Button} from '~/components/ui/button'
import {cn} from '~/utils'

export const Sun = ({user, className}: {user: User; className?: string}) => {
	return (
		<Button
			onClick={() => signIn('github', {callbackUrl: '/'})}
			className={cn(
				className,
				'center group h-9 w-9 rounded-full border border-white bg-gradient-to-t from-sunset to-orange-500 drop-shadow-glow transition-all hover:w-32 hover:border-sunset hover:from-white dark:border-black dark:hover:from-black dark:hover:to-black'
			)}>
			<span className='whitespace-nowrap text-base opacity-0 transition-opacity group-hover:opacity-100'>
				{user ? 'Dashboard' : 'Log in'}
			</span>
		</Button>
	)
}
