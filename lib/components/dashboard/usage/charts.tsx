import {getServerSession} from 'next-auth'
import {authOptions} from '~/authOptions'
import prisma from '~/prisma'
import TestChart from './test-chart'

type UsageDay = {
	usageDay: Date
	usageCount: number
	totalTokens: number
}

export default async function Charts() {
	const session = await getServerSession(authOptions)

	if (!session) return <div>Not authenticated</div>

	const groupUsage: UsageDay[] = await prisma.$queryRaw`
      SELECT DATE(U.createdAt) AS usageDay, 
           COUNT(U.id) AS usageCount,
           SUM(U.promptTokens + U.completionTokens) AS totalTokens
    FROM Usage U
    INNER JOIN Project P ON U.projectId = P.id
    INNER JOIN Customer C ON P.customerId = C.id
    WHERE U.createdAt >= '2024-01-14' 
    AND U.createdAt <= '2024-01-30'
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

    console.log(groupUsage)

	return (
		<div className='gap-5 flex md:flex-row flex-col'>
			<TestChart
				data={convertedUsage}
				category='runs'
				color='green'
			/>

			<TestChart
				data={tokensUsage}
				category='tokens'
				color='orange'
			/>
		</div>
	)
}
