import {ReactNode} from 'react'

export function SmallBody({children}: {children: ReactNode}) {
	return <p className='font-[12px] leading-normal'>{children}</p>
}
