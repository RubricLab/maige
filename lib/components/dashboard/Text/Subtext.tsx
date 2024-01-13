import {ReactNode} from 'react'

export function Subtext({children}: {children: ReactNode}) {
	return <p className='font-[16px] leading-normal text-grey'>{children}</p>
}
