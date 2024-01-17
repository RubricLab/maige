"use server"

import {getServerSession} from 'next-auth'
import {authOptions} from '~/authOptions'
import prisma from '~/prisma'

export async function submitFeedback(content: string){
    const session = await getServerSession(authOptions)
    if (!session) return "not logged in"

    const customer = await prisma.customer.findUnique({
		where: {
			githubUserId: session.user.githubUserId
		}
	})

    await prisma.feedback.create({
        data: {
            content,
            customerId: customer.id
        }
    })
}