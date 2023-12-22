'use client'

import {Session} from 'next-auth'
import {signOut} from 'next-auth/react'
import Image from 'next/image'
import {useState} from 'react'
import MaigeLogo from '../../../../public/logo.png'
import {PrimaryButton} from '../Buttons'
import {SmallHeading, Subtext} from '../Text'

export function MainNavigation({
	session,
	avatarUrl
}: {
	session: Session
	avatarUrl: string
}) {
	const [dropdownOpen, setDropdownOpen] = useState(false)
	return (
		<div className='flex w-full flex-row items-center justify-between pb-10'>
			<Image
				src={MaigeLogo}
				width={50}
				height={50}
				className='rounded-full object-cover'
				alt='Maige Logo'
			/>
			<div className='relative'>
				<Image
					src={avatarUrl}
					width={50}
					height={50}
					className='cursor-pointer rounded-full object-cover'
					onClick={() => setDropdownOpen(!dropdownOpen)}
					alt='User avatar'
				/>
				{dropdownOpen && (
					<div className='bg-panel border-panel-border absolute right-1/2 rounded-lg border-2 p-8'>
						<div className='pb-6'>
							<SmallHeading>{session.user.name}</SmallHeading>
							<Subtext>{session.user.email}</Subtext>
						</div>
						<PrimaryButton onClick={() => signOut()}>Sign out</PrimaryButton>
					</div>
				)}
			</div>
		</div>
	)
}
