import 'next-auth'
import {DefaultSession} from 'next-auth'

declare module 'next-auth' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: {
			id: string
			name: string
			email: string
			image: string
			userName: string
		} & DefaultSession['user']
	}

	interface Profile {
		id: string
		name: string
		email: string
		image: string
		userName: string
	}
}
