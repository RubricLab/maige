import {getServerSession} from 'next-auth'
import {authOptions} from '~/authOptions'
import prisma from '~/prisma'
import {Chart} from '.'

type UsageDay = {
	usageDay: Date
	logCount: number
	totalTokens: number
	runCount: number
}

export async function UsageCharts({route}: {route: string}) {
	const session = await getServerSession(authOptions)
	if (!session) return <div>Not authenticated</div>

	const groupUsage: UsageDay[] = await prisma.$queryRaw`
		SELECT
			DATE(L.createdAt) AS usageDay,
			COUNT(DISTINCT L.id) AS logCount,
			SUM(L.totalTokens) AS totalTokens,
			COUNT(DISTINCT R.id) AS runCount
		FROM
			Log L
			INNER JOIN Run R ON L.runId = R.id
			INNER JOIN Project P ON R.projectId = P.id
			INNER JOIN User C ON P.createdBy = C.id
		WHERE
			L.createdAt >= CURDATE() - INTERVAL 14 DAY
			AND L.createdAt < CURDATE() + INTERVAL 1 DAY -- Adjusted to '<' for end of day
			AND C.id = 'cls6ba5iy0000ohopf58h03ot'
		GROUP BY
			usageDay
		ORDER BY
			usageDay;
	`

	const logUsage = groupUsage.map(row => ({
		date: new Date(row.usageDay).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		}),
		logs: Number(row.logCount)
	}))

	const tokensUsage = groupUsage.map(row => ({
		date: new Date(row.usageDay).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		}),
		tokens: Number(row.totalTokens)
	}))

	const runUsage = groupUsage.map(row => ({
		date: new Date(row.usageDay).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		}),
		runs: Number(row.runCount)
	}))

	if (route === 'runs')
		return (
			<Chart
				data={runUsage}
				category='runs'
				color='green'
			/>
		)

	if (route === 'tokens')
		return (
			<Chart
				data={tokensUsage}
				category='tokens'
				color='orange'
			/>
		)

	if (route === '')
		return (
			<Chart
				data={logUsage}
				category='logs'
				color='purple'
			/>
		)
}
