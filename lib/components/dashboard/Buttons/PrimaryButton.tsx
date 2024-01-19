'use client'

import {motion} from 'framer-motion'
import {ReactNode} from 'react'
import {SpinnerLoader} from '~/components/dashboard/Loader'
import {cn} from '~/utils'
import {SmallBody} from '../Text'

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
