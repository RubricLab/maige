'use client'

import { useRouter, usePathname } from 'next/navigation';
import {useEffect, useState} from 'react'
import {Input} from '~/components/ui/input'
import {useDebounce} from '~/hooks/debounce'

type Props = {
	searchValue: string
}

export default function TableSearch({searchValue}: Props) {
	const router = useRouter()
	const pathname = usePathname()
	const [search, setSearch] = useState<string>(searchValue)
	const debouncedSearchTerm = useDebounce(search, 200)

	useEffect(() => {
		router.replace(`${pathname}?q=${encodeURIComponent(debouncedSearchTerm)}`)
	}, [pathname, router, debouncedSearchTerm])

	return (
		<Input
			placeholder='Search actions...'
			value={search}
			onChange={e => {setSearch(e.currentTarget.value)}}
			className='max-w-sm'
		/>
	)
}
