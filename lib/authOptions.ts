import { PrismaAdapter } from '@auth/prisma-adapter'
import type { AuthOptions, Profile } from 'next-auth'
import GithubProvider, { type GithubProfile } from 'next-auth/providers/github'
import prisma from '~/prisma'
import env from './env'

const prismaAdapter = PrismaAdapter(prisma)

// @ts-ignore
prismaAdapter.createUser = data => {
	return prisma.user.upsert({
		// migration flow
		where: { userName: data.userName as string },
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
			profile(profile: GithubProfile): Profile {
				// Add user profile information
				return {
					id: profile.id.toString(),
					githubUserId: profile.id.toString(),
					name: profile.name as string,
					email: profile.email as string,
					image: profile.avatar_url,
					userName: profile.login
				}
			}
		})
	],
	callbacks: {
		session: async ({ session, user }) => {
			session.user.id = user.id
			session.user.userName = user.userName
			session.user.usage = user.usage
			return session
		}
	}
}
