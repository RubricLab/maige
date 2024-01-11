import {ReactNode} from 'react'

export function MediumBody({children}: {children: ReactNode}) {
	return <p className='font-[16px] leading-normal'>{children}</p>
}
