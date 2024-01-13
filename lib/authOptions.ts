import {AuthOptions, Profile} from 'next-auth'
import GithubProvider, {GithubProfile} from 'next-auth/providers/github'
import prisma from '~/prisma'
import env from './env.mjs'

export const authOptions: AuthOptions = {
	providers: [
		GithubProvider({
			clientId: env.DASHBOARD_GITHUB_ID as string,
			clientSecret: env.DASHBOARD_GITHUB_SECRET as string,
			profile(profile: GithubProfile) {
				return {
					id: profile.id.toString(),
					name: profile.name,
					userName: profile.login,
					email: profile.email,
					image: profile.avatar_url
				}
			}
		})
	],
	// attach the githubUserId that we store server side below to our session
	callbacks: {
		async session({session, token}) {
			session.user.githubUserId = token.sub
			return session
		}
	},
	// by design, NextAuth does not expose a user's Github username to the client and in our session object, only their github numeric user ID. So, we need to store this numeric ID in our DB
	// this is so we can know who is making the request on the server
	events: {
		async signIn({account, profile}) {
			const typedProfile: Profile & {userName?: string} = profile
			await prisma.customer.update({
				where: {name: typedProfile.userName},
				data: {
					githubUserId: account.providerAccountId
				}
			})
		}
	}
}
