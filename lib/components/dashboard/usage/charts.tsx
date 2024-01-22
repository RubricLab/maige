import {getServerSession} from 'next-auth'
import {authOptions} from '~/authOptions'
import prisma from '~/prisma'
import {Chart} from './'

type UsageDay = {
	usageDay: Date
	usageCount: number
	totalTokens: number
}

export async function UsageCharts({route}: {route: string}) {
	const session = await getServerSession(authOptions)

	if (!session) return <div>Not authenticated</div>

	// To mitigate SQL injection
	if (session.user?.githubUserId?.length > 16) return <div>Bad GitHub ID</div>

	const dateStringByOffset = (offset: number): string => {
		const date = new Date()
		date.setDate(date.getDate() + offset)
		return date.toISOString().split('T')[0]
	}

	const groupUsage: UsageDay[] = await prisma.$queryRaw`
		SELECT DATE(U.createdAt) AS usageDay, 
			COUNT(U.id) AS usageCount,
			SUM(U.totalTokens) AS totalTokens
    FROM Usage U
    INNER JOIN Project P ON U.projectId = P.id
    INNER JOIN Customer C ON P.customerId = C.id
    WHERE U.createdAt >= ${dateStringByOffset(-14)} 
    AND U.createdAt <= ${dateStringByOffset(1)}
    AND C.githubUserId = ${session.user.githubUserId}
    GROUP BY usageDay
    ORDER BY usageDay;
	`

	const convertedUsage = groupUsage.map(row => ({
		date: new Date(row.usageDay).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		}),
		runs: Number(row.usageCount)
	}))

	const tokensUsage = groupUsage.map(row => ({
		date: new Date(row.usageDay).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		}),
		tokens: Number(row.totalTokens)
	}))

	if (route === 'runs')
		return (
			<Chart
				data={convertedUsage}
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
				data={tokensUsage}
				category='tokens'
				color='purple'
			/>
		)
}
