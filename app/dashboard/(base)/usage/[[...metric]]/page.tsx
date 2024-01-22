import {UsageTable} from '~/components/dashboard/Usage/TableWrapper'

export default async function Usage({
	searchParams,
	params
}: {
	searchParams: {[key: string]: string | string[] | undefined}
	params: {
		metric: string[] | undefined
	}
}) {
	const route = params.metric ? params.metric[0] : ''

	return (
		<UsageTable
			route={route}
			searchParams={searchParams}
		/>
	)
}
