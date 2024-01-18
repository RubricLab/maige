import React from 'react'
import {getServerSession} from 'next-auth'
import { redirect } from 'next/navigation'
import {authOptions} from '~/authOptions'
import { CustomTable } from '~/components/dashboard/usage/custom-table';
import Link from 'next/link'
import z from 'zod'
import { cn } from '~/utils'
import { Button } from '~/components/ui/button'
import TableSearch from '~/components/dashboard/usage/search'
import { PrismaClient } from '@prisma/client'

type UsageProject = {
  name: string;
  id: string;
}

export type UsageRow = {
  id: string;
  createdAt: Date;
  action: string;
  agent: string;
  tokens: number;
  model: string;
  project: UsageProject;
};

const UsageParamsSchema = z.object({
  q: z.coerce.string().optional(),
  p: z.coerce.number().min(1).optional().default(1),
  col: z.enum(["createdAt", "tokens", "action", "agent", "model"]).optional(),
  dir: z.enum(["asc", "desc"]).optional(),
});

export const prismaUsage = new PrismaClient().$extends({
  result: {
    usage: {
      tokens: {
        needs: { promptTokens: true, completionTokens: true },
        compute(usage) {
          return usage.completionTokens + usage.promptTokens
        },
      },
    },
  },
})


export default async function UsageDefault({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions)

  const usageQuery = UsageParamsSchema.safeParse(searchParams);

  if (!usageQuery.success) return <p>Bad request</p>;

	if (!session) redirect('/auth')

  const pageSize = 5
  const pageNum = usageQuery.data.p

  const usageFilter = {
    project: {customer: {githubUserId: session.user.githubUserId}},
  }

  usageFilter["action"] = { contains: usageQuery.data.q}

  const filCol = usageQuery.data.col
 const usageOrder = {}
 if(filCol) usageOrder[filCol] = usageQuery.data.dir

  const start = performance.now();
  const usage: UsageRow[] = await prismaUsage.usage.findMany({
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
    ...(usageQuery.data.q ? { q: usageQuery.data.q } : {}),
    ...(usageQuery.data.col ? { col: usageQuery.data.col } : {}),
    ...(usageQuery.data.dir ? { dir: usageQuery.data.dir } : {}),
  }).toString();

  return (
    <div className='flex flex-col gap-2 w-full'>
      <div className='inline-flex lg:items-center justify-between lg:flex-row flex-col gap-3'><div className='inline-flex gap-2 text-xs font-mono bg-green-800 bg-opacity-50 px-2 py-0.5 rounded-md w-fit'> <span><span className='text-green-400'>{usageNum}</span> Total Results</span>/<span>Fetched Page in <span className='text-green-400'>{timeTaken.toFixed(4)}</span> ms</span></div><TableSearch searchValue={usageQuery.data.q ? usageQuery.data.q : ""}/></div>
      <div className='overflow-hidden max-w-full flex'>
      <CustomTable params={usageQuery.data} data={usage}/></div>
      <div className="space-x-2 flex justify-end">
      {
        Array.from({length: Math.ceil(usageNum / pageSize)}, (_, i) => i).map((i) => (
          <Link replace={true} prefetch={true} href={`/dashboard/usage?${params}&p=${i+1}`} key={i}><Button className={cn({ 'bg-neutral-700': i+1 === pageNum })} size="sm" variant='outline'>{i+1}</Button></Link>
        ))
      }</div>
    </div>
  )
}