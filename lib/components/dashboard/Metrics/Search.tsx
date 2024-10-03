'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Input } from '~/components/ui/input'
import { useDebounce } from '~/hooks/debounce'

type Props = {
	searchValue: string
	route: string
	teamSlug: string
}

export function TableSearch({ searchValue, route, teamSlug }: Props) {
	const router = useRouter()
	const [search, setSearch] = useState<string>(searchValue)
	const debouncedSearchTerm = useDebounce(search, 200)

	useEffect(() => {
		if (debouncedSearchTerm === '') return router.replace(`/${teamSlug}/usage/${route}`)
		router.replace(`/${teamSlug}/usage/${route}?q=${encodeURIComponent(debouncedSearchTerm)}`)
	}, [router, debouncedSearchTerm, route, teamSlug])

	return (
		<Input
			placeholder="Search actions..."
			value={search}
			onChange={e => setSearch(e.currentTarget.value)}
			className="max-w-sm"
		/>
	)
}
