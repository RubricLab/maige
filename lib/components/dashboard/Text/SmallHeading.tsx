import {ReactNode} from 'react'

export function SmallHeading({children}: {children: ReactNode}) {
	return <p className='text-[24px] font-bold leading-tight'>{children}</p>
}
