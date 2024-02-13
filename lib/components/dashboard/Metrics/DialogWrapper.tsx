'use client'

import {ArrowRightIcon} from '@radix-ui/react-icons'
import React from 'react'
import {Button} from '~/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '~/components/ui/dialog'

type Props = {
	children: React.ReactNode
	runId: string
	title: string
}

export default function DialogWrapper({children, runId, title}: Props) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='outline'>
					View
					<ArrowRightIcon className='h-4 w-4' />
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-[90vw]'>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	)
}
