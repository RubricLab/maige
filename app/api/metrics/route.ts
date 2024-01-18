import {getServerSession} from 'next-auth'
import {NextRequest, NextResponse} from 'next/server'
import z from 'zod'
import {authOptions} from '~/authOptions'
import prisma from '~/prisma'
import env from '~/env.mjs'

type UsageProject = {
	name: string
	id: string
}

export type UsageRow = {
	id: string
	createdAt: Date
	action: string
	agent: string
	promptTokens: number
	completionTokens: number
	model: string
	project: UsageProject
}

const UsageParamsSchema = z.object({
	q: z.coerce.string().optional(),
	p: z.coerce.number().min(1).optional().default(1),
	col: z.enum(['createdAt', 'tokens', 'action', 'agent', 'model']).optional(),
	dir: z.enum(['asc', 'desc']).optional()
})

const pageSize = 5

export const POST = async (req: NextRequest, res: NextResponse) => {

	// const session = await getServerSession(authOptions)
    // console.log(session)
	// if (!session) return NextResponse.json({error: 'Unauthorized'}, {status: 401})

	const usageQuery = UsageParamsSchema.safeParse(await req.json())
	if (usageQuery.success === false)
		return NextResponse.json({
			error: usageQuery.error
		})

	const {q, p, col, dir} = usageQuery.data

	const usageFilter = {
		project: {customer: {githubUserId: "63890951"}}
	}

	usageFilter['action'] = {contains: q}

	const usageOrder = {}
	if (col) usageOrder[col] = dir

	const usage: UsageRow[] = await prisma.usage.findMany({
		take: pageSize,
		skip: pageSize * (p - 1),
		where: usageFilter,
		orderBy: usageOrder as any,
		include: {
			project: {
				select: {
					name: true,
					id: true
				}
			}
		}
	})

	const usageNum: number = await prisma.usage.count({
		where: usageFilter
	})

	return NextResponse.json({
		usage: usage,
		totalCount: usageNum
	})
}
