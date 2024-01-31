'use client'

import {SessionProvider} from 'next-auth/react'
import {Toaster} from 'sonner'
import {ThemeProvider} from './ThemesProvider'

export default function Providers({children}: {children: React.ReactNode}) {
	return (
		<SessionProvider>
			<Toaster position='bottom-right' />
			<ThemeProvider
				attribute='class'
				defaultTheme='system'
				enableSystem>
				{children}
			</ThemeProvider>
		</SessionProvider>
	)
}
