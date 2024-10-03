'use client'

import { InfoIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { copyToClipboard } from '~/utils'

export default function Blocked() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
			<h1>Access blocked</h1>
			<div className="flex items-center gap-2 rounded-sm border border-border p-4">
				<InfoIcon />
				<p>
					Rate limit exceeded. You made too many requests in a short period of time. Please try again
					later.
				</p>
			</div>
			<p>
				If this is unexpected, please email us at{' '}
				<Button
					variant="link"
					size="none"
					onClick={() => copyToClipboard('hello@rubriclabs.com', 'Email copied to clipboard')}
				>
					hello@rubriclabs.com
				</Button>
			</p>
		</div>
	)
}
