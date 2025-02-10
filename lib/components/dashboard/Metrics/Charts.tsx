import { getServerSession } from 'next-auth'
import { authOptions } from '~/authOptions'
import prisma from '~/prisma'
import { Chart } from '.'

type UsageDay = {
	usageDay: Date
	logCount: number
	totalTokens: number
	runCount: number
}

export async function UsageCharts({
	route,
	teamSlug
}: {
	route: string
	teamSlug: string
}) {
	const session = await getServerSession(authOptions)
	if (!session) return <div>Not authenticated</div>

	const team = await prisma.team.findUnique({
		where: { slug: teamSlug },
		select: {
			id: true
		}
	})

	const groupUsage: UsageDay[] = await prisma.$queryRaw`
		SELECT
			L."createdAt" AS "usageDay",
			COUNT(DISTINCT L.id) AS logs,
			SUM(L."totalTokens") AS tokens,
			COUNT(DISTINCT R.id) AS runs
		FROM
			Log L
			INNER JOIN "Run" R ON L."runId" = R.id
			INNER JOIN "Project" P ON R."projectId" = P.id
		WHERE
			L."createdAt" >= CURDATE() - INTERVAL 14 DAY
			AND L."createdAt" < CURDATE() + INTERVAL 1 DAY
			AND P."teamId" = ${team?.id}
		GROUP BY
			"usageDay"
		ORDER BY
			"usageDay";
	`
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	function mapAndAggregateUsage(usageArray: any, key: string) {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const mappedUsage = usageArray.map((row: any) => ({
			date: new Date(row.usageDay).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric'
			}),
			[key]: Number(row[key])
		}))

		return Object.values(
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			mappedUsage.reduce((acc: any, cur: any) => {
				const date = cur.date
				if (!acc[date]) acc[date] = { date, [key]: 0 }
				acc[date][key] += cur[key]
				return acc
			}, {})
		)
	}

	const aggregatedLogUsage = mapAndAggregateUsage(groupUsage, 'logs')
	const aggregatedTokensUsage = mapAndAggregateUsage(groupUsage, 'tokens')
	const aggregatedRunUsage = mapAndAggregateUsage(groupUsage, 'runs')

	if (route === 'runs') return <Chart data={aggregatedRunUsage} category="runs" color="green" />

	if (route === 'tokens')
		return <Chart data={aggregatedTokensUsage} category="tokens" color="orange" />

	if (route === '') return <Chart data={aggregatedLogUsage} category="logs" color="purple" />
	return
}
