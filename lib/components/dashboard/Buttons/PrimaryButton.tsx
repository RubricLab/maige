'use client'

import {SpinnerLoader} from 'app/dashboard/Loader'
import {motion} from 'framer-motion'
import {ReactNode} from 'react'
import {SmallBody} from '../Text'
import { cn } from '~/utils'

export function PrimaryButton({
	onClick,
	loading = false,
	className,
	children
}: {
	onClick?: () => void
	loading?: boolean
	children: ReactNode
	className: string
}) {
	return (
		<motion.button
			className={cn(className)}
			onClick={onClick}>
			{loading && <SpinnerLoader />}
			{!loading && <SmallBody>{children}</SmallBody>}
		</motion.button>
	)
}
