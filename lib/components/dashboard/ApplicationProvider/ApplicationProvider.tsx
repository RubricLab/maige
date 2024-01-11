'use client'

import {SessionProvider} from 'next-auth/react'

export function ApplicationProvider({children}: {children: React.ReactNode}) {
	return <SessionProvider>{children}</SessionProvider>
}
