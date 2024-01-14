import React from 'react'
import prisma from '~/prisma'
import {getServerSession} from 'next-auth'
import { redirect } from 'next/navigation'
import {authOptions} from '~/authOptions'
import { CustomTable } from '~/components/dashboard/usage/custom-table';
import Link from 'next/link'
import z from 'zod'
import { cn } from '~/utils'
import { Button } from '~/components/ui/button'

type UsageProject = {
  name: string;
  id: string;
}

export type UsageRow = {
  id: string;
  createdAt: Date;
  action: string;
  agent: string;
  tokens: string;
  model: string;
  project: UsageProject;
};

const UsageParamsSchema = z.object({
  q: z.string().optional(),
  p: z.coerce.number().min(1).optional().default(1),
  column: z.enum(["createdAt", "tokens", "action", "agent", "model"]).optional(),
  dir: z.enum(["asc", "desc"]).optional(),
});


export default async function Usage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions)

  const usageQuery = UsageParamsSchema.safeParse(searchParams);

  if (!usageQuery.success) return <p>Bad request</p>;

	if (!session) redirect('/auth')

  const pageSize = 3
  const pageNum = usageQuery.data.p

  const usageFilter = {
    // customer: {
    //   githubUserId: session.user.githubUserId
    // }
    projectId: {in: ['clp8s056r001awirtqv7rocff', "clq4dp0k700043imqk197aoc7"]},
  }

  usageFilter["agent"] = { contains: 'agent' }

 const usageOrder = {
    // "agent": 'asc',
 }
  const start = performance.now();
  const usage: UsageRow[] = await prisma.usage.findMany({
    take: pageSize,
    skip: pageSize * (pageNum - 1),
    where: usageFilter,
    orderBy: usageOrder as any,
    include: {
      project: {
        select: {
          name: true,
          id: true,
        },
      },
    },
	})
  const end = performance.now();
  const timeTaken = end - start;

  const usageNum: number = await prisma.usage.count({
		where: usageFilter,
	})

  const params = new URLSearchParams({
    ...(usageQuery.data.q ? { query: usageQuery.data.q } : {}),
  }).toString();

  return (
    <div className='flex flex-col gap-2'>
      <div className='inline-flex gap-2 text-xs font-mono'> <span><span className='text-green-400'>{usageNum}</span> Total Results</span>/<span>Fetched Page in <span className='text-green-400'>{timeTaken.toFixed(4)}</span> ms</span></div>
      <CustomTable data={usage}/>
      <div className="space-x-2 flex justify-end">
      {
        Array.from({length: Math.ceil(usageNum / pageSize)}, (_, i) => i).map((i) => (
          <Link prefetch={true} href={`/dashboard/usage?${params}&p=${i+1}`} key={i}><Button className={cn({ 'bg-neutral-700': i+1 === pageNum })} size="sm" variant='outline'>{i+1}</Button></Link>
        ))
      }</div>
    </div>
  )
}