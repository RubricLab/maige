import { UsageTable } from "~/components/dashboard/Metrics";

export default async function Usage({
	searchParams,
	params,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
	params: {
		slug: string;
		metric: string[] | undefined;
	};
}) {
	const route = params.metric ? params.metric[0] : "";

	return (
		<UsageTable
			teamSlug={params.slug}
			route={route as string}
			searchParams={searchParams}
		/>
	);
}
