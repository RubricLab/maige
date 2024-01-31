import * as React from 'react'

import {cn} from '~/utils'

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({className, ...props}, ref) => {
		return (
			<textarea
				className={cn(
					'border-tertiary placeholder:text-tertiary flex min-h-[60px] w-full rounded-sm border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
					className
				)}
				ref={ref}
				{...props}
			/>
		)
	}
)
Textarea.displayName = 'Textarea'

export {Textarea}
