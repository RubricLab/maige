import {ReactNode} from 'react'

export function LargeHeading({children}: {children: ReactNode}) {
	return <p className='text-[36px] font-bold leading-tight'>{children}</p>
}
