import {PrismaAdapter} from '@auth/prisma-adapter'
import {AuthOptions, Profile} from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import prisma from '~/prisma'
import env from './env.mjs'

const prismaAdapter = PrismaAdapter(prisma)

prismaAdapter.createUser = data => {
	return prisma.user.upsert({
		// migration flow
		where: {userName: data.userName},
		update: data,

		// default flow
		create: data
	})
}

export const authOptions: AuthOptions = {
	adapter: prismaAdapter,
	providers: [
		GithubProvider({
			clientId: env.GITHUB_CLIENT_ID as string,
			clientSecret: env.GITHUB_CLIENT_SECRET as string,
			profile(profile): Profile {
				// Add user profile information
				return {
					id: profile.id.toString(),
					name: profile.name,
					email: profile.email,
					image: profile.avatar_url,
					userName: profile.login
				}
			}
		})
	],
	callbacks: {
		session: async ({session, user}) => {
			session.user.id = user.id
			session.user.userName = user.userName
			return session
		}
	}
}
