import 'next-auth'

declare module 'next-auth' {
	interface Session {
		user: User & {
			id: UserId
		}
	}
}
