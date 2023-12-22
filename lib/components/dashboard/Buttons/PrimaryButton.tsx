'use client'

import {SpinnerLoader} from 'app/dashboard/Loader'
import {motion} from 'framer-motion'
import {ReactNode} from 'react'
import {SmallBody} from '../Text'

export function PrimaryButton({
	onClick,
	loading = false,
	children
}: {
	onClick?: () => void
	loading?: boolean
	children: ReactNode
}) {
	return (
		<motion.button
			whileHover={{
				scale: 1.05,
				transition: {
					duration: 0.5
				}
			}}
			className='rounded-[10px] bg-white px-4 py-2 text-black'
			onClick={onClick}>
			{loading && <SpinnerLoader />}
			{!loading && <SmallBody>{children}</SmallBody>}
		</motion.button>
	)
}
