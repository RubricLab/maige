import {ReactNode} from 'react'

export function Subtext({children}: {children: ReactNode}) {
	return <p className='text-grey font-[16px] leading-normal'>{children}</p>
}
