import Link from 'next/link'
import {redirect} from 'next/navigation'
import z from 'zod'
import {Button} from '~/components/ui/button'
import prisma from '~/prisma'
import {cn} from '~/utils'
import {getCurrentUser} from '~/utils/session'
import {CustomTable} from '.'
import ProjectFilterWrapper from './projectFilterWrapper'

type RunProject = {
	name: string
	id: string
}

export type RunLog = {
	id: string
	runId: string
	action: string
	agent: string
	model: string
	status: string
	promptTokens?: number
	completionTokens?: number
	totalTokens?: number
	createdAt: Date
	finishedAt?: Date
}

export type RunRow = {
	id: string
	issueNum: number
	issueUrl: string
	projectId: string
	createdAt: Date
	finishedAt?: Date
	status: string
	project: RunProject
	logs?: RunLog[]
}

const UsageParamsSchema = z.object({
	q: z.coerce.string().optional(),
	p: z.coerce.number().min(1).optional().default(1),
	col: z.enum(['createdAt', 'finishedAt', 'project', 'issueNum']).optional(),
	dir: z.enum(['asc', 'desc']).optional(),
	proj: z.string().optional()
})

export async function UsageTable({
	teamSlug,
	searchParams,
	route
}: {
	teamSlug: string
	searchParams: {[key: string]: string | string[] | undefined}
	route: string
}) {
	const user = await getCurrentUser()
	const usageQuery = UsageParamsSchema.safeParse(searchParams)

	if (!usageQuery.success) return <p>Bad request</p>
	if (!user) redirect('/')

	const team = await prisma.team.findUnique({
		where: {slug: teamSlug},
		select: {
			id: true
		}
	})

	if (!team) return <p>Team not found</p>

	const pageSize = 5
	const pageNum = usageQuery.data.p

	// const usageFilter = {
	// 	project: {user: {id: user.id}},
	// 	agent: {contains: usageQuery.data.q}
	// }

	const usageOrder = {
		...(usageQuery.data.col && {[usageQuery.data.col]: usageQuery.data.dir})
	}

	const start = performance.now()
	const runs: RunRow[] = await prisma.run.findMany({
		where: {
			teamId: team.id,
			projectId: usageQuery.data.proj
		},
		take: pageSize,
		skip: pageSize * (pageNum - 1),
		// where: usageFilter,
		orderBy: usageOrder,
		include: {
			project: {
				select: {
					name: true,
					id: true
				}
			}
		}
	})

	const end = performance.now()
	const timeTaken = Math.floor(end - start)
	const usageNum = runs?.length || 0

	const params = new URLSearchParams({
		...(usageQuery.data.q ? {q: usageQuery.data.q} : {}),
		...(usageQuery.data.col ? {col: usageQuery.data.col} : {}),
		...(usageQuery.data.dir ? {dir: usageQuery.data.dir} : {}),
		...(usageQuery.data.proj ? {proj: usageQuery.data.proj} : {})
	}).toString()

	return (
		<div className='flex w-full flex-col gap-2'>
			<div className='inline-flex flex-col justify-between gap-3 lg:flex-row lg:items-center'>
				<div className='text-tertiary inline-flex w-fit gap-2 rounded-md bg-green-100 px-2 py-0.5 font-mono text-xs dark:bg-green-950'>
					<span className='text-green-700 dark:text-green-400'>{usageNum}</span>
					results in
					<span className='text-green-700 dark:text-green-400'>{timeTaken}</span> ms
				</div>
				{/* <TableSearch
					teamSlug={teamSlug}
					route={route}
					searchValue={usageQuery.data.q ? usageQuery.data.q : ''}
				/> */}
				<ProjectFilterWrapper
					proj={usageQuery.data.proj}
					teamSlug={teamSlug}
					teamId={team.id}
				/>
			</div>
			<div className='flex max-w-full overflow-hidden'>
				<CustomTable
					teamSlug={teamSlug}
					route={route}
					params={usageQuery.data}
					data={runs}
				/>
			</div>
			<div className='flex justify-end space-x-2'>
				{Array.from({length: Math.ceil(usageNum / pageSize)}, (_, i) => i).map(
					i => (
						<Link
							replace={true}
							prefetch={false}
							href={`/${teamSlug}/usage/${route}?${params}&p=${i + 1}`}
							key={i}>
							<Button
								className={cn({'bg-neutral-800': i + 1 === pageNum})}
								size='sm'
								variant='outline'>
								{i + 1}
							</Button>
						</Link>
					)
				)}
			</div>
		</div>
	)
}
