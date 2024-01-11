import {DefaultSession} from 'next-auth'

declare module 'next-auth' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: {
			/** The user's githuber User ID */
			githubUserId: string
		} & DefaultSession['user']
	}
}
