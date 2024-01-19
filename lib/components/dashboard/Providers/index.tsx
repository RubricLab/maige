'use client'

import {SessionProvider} from 'next-auth/react'
import {ThemeProvider} from './ThemesProvider'

export default function Providers({children}: {children: React.ReactNode}) {
	return (
		<SessionProvider>
			<ThemeProvider
				attribute='class'
				defaultTheme='system'
				enableSystem>
				{children}
			</ThemeProvider>
		</SessionProvider>
	)
}
