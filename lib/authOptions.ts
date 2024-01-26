import {PrismaAdapter} from '@auth/prisma-adapter'
import {AuthOptions} from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import prisma from '~/prisma'
import env from './env.mjs'

export const authOptions: AuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GithubProvider({
			clientId: env.GITHUB_CLIENT_ID as string,
			clientSecret: env.GITHUB_CLIENT_SECRET as string
		})
	]
}
