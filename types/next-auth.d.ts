import 'next-auth'
import type {Profile as DefaultProfile} from 'next-auth'
import {DefaultSession, DefaultUser} from 'next-auth'
import type {AdapterUser as DefaultAdapterUser} from 'next-auth/adapters'

// Make changes to the ExtendedUser interface to see them in session, profile, DB
interface ExtendedUser extends DefaultUser {
	userName: string
}

declare module 'next-auth' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */

	interface User extends ExtendedUser {}

	interface Session extends DefaultSession {
		user: User
	}

	interface Profile extends DefaultProfile, ExtendedUser {}
}

declare module '@auth/core/adapters' {
	interface AdapterUser extends DefaultAdapterUser, ExtendedUser {}
}
