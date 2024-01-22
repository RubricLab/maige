import {Test} from '~/components/Test'

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
		<Test />

		// <UsageTable
		// 	route={route}
		// 	searchParams={searchParams}
		// />
	)
}
