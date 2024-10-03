'use client'

import { copyToClipboard } from '~/utils'
import { Button } from './button'

export const CopyTextButton = ({
	text,
	label,
	className
}: {
	text: string
	label?: string
	className?: string
}) => {
	return (
		<Button variant={'outline'} className={className} onClick={() => copyToClipboard(text)}>
			{label || 'Copy'}
		</Button>
	)
}
