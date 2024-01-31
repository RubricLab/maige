'use client'

import {motion} from 'framer-motion'
import {ReactNode} from 'react'

export function SecondaryButton({
	onClick,
	children
}: {
	onClick?: () => void
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
			className='bg-primary rounded-[10px] border-2 px-4 py-2'
			onClick={onClick}>
			<p>{children}</p>
		</motion.button>
	)
}
