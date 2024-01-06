import React from 'react'
import prisma from '~/prisma'
import {getServerSession} from 'next-auth'
import { redirect } from 'next/navigation'
import {authOptions} from '~/authOptions'
import { DataTableDemo } from '~/components/dashboard/usage/data-table'

type Props = {}

export default async function Usage({}: Props) {
  const session = await getServerSession(authOptions)

	if (!session) redirect('/auth')

  // const usage = await prisma.project.findMany({
	// 	where: {
	// 		// customer: {
  //     //   githubUserId: session.user.githubUserId
  //     // }
  //     id: {in: ['project_1', 'project_2', 'project_3']},
  //   },
  //   select: {
  //     id: true,
  //     // project: {
  //     //   select: {
  //     //     id: true,
  //     //     name: true,
  //     //     createdAt: true,
  //     //     customInstructions: true,
  //     //   }
  //     // }
  //     name: true,
  //     usage: {
  //       select : {
  //         id: true,
  //         createdAt: true,
  //         action: true,
  //         agent: true,
  //         tokens: true,
  //         model: true,
  //       }
  //     }
  //   },
	// })

  const data: any[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@gmail.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@gmail.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@gmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
  },
]

  return (
    <div><DataTableDemo data={data}/></div>
  )
}