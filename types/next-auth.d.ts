import {User} from '@prisma/client'
import 'next-auth'
import type {Profile as DefaultProfile} from 'next-auth'
import {DefaultSession, DefaultUser} from 'next-auth'
import type {AdapterUser as DefaultAdapterUser} from 'next-auth/adapters'

// Make changes to the ExtendedUser and ExtendedSessionUser interfaces
// Pick these from DB schema ex. Pick<User, 'usage' | 'email' | ...

/* ************ EDIT ************ */

interface ExtendedUser
	extends Omit<ExtendedUser, 'id'>,
		Pick<User, 'userName' | 'githubUserId'> {}

interface ExtendedSessionUser extends DefaultUser, Pick<User, 'userName'> {}

/* ********* DON'T EDIT ********* */

declare module 'next-auth' {
	interface Profile extends DefaultProfile, ExtendedUser {}

	interface User extends ExtendedUser {
		id?: string
	}

	interface Session extends DefaultSession {
		user: ExtendedSessionUser
	}
}

declare module '@auth/core/adapters' {
	interface AdapterUser extends DefaultAdapterUser, ExtendedUser {}
}

declare module 'next-auth/adapters' {
	interface AdapterUser extends DefaultAdapterUser, ExtendedSessionUser {}
}
