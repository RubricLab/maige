import {PrismaAdapter} from '@auth/prisma-adapter'
import {AuthOptions} from 'next-auth'
import GithubProvider, {type GithubProfile} from 'next-auth/providers/github'
import prisma from '~/prisma'
import env from './env.mjs'

export const authOptions: AuthOptions = {
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: 'jwt'
	},
	providers: [
		GithubProvider({
			clientId: env.GITHUB_CLIENT_ID as string,
			clientSecret: env.GITHUB_CLIENT_SECRET as string,
			profile(profile: GithubProfile) {
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
		session: async ({token, session}) => {
			if (token) {
				session.user.id = token.sub
				session.user.name = token.name
				session.user.email = token.email
				session.user.image = token.picture
			}
			return session
		}
	}
}
