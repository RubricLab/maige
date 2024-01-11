import {ReactNode} from 'react'

export function LargeBody({children}: {children: ReactNode}) {
	return <p className='text-[20px] leading-normal'>{children}</p>
}
