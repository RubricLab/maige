import type { Metadata, Viewport } from 'next'
import Providers from '~/components/dashboard/Providers'
import '~/styles/globals.css'
import { jakarta, monocraft, roboto } from '~/utils/fonts'

const title = 'Maige'
const description = 'AI-powered codebase actions.'

export const viewport: Viewport = {
	themeColor: '#000'
}

export const metadata: Metadata = {
	title,
	description,
	metadataBase: new URL('https://maige.app'),
	alternates: {
		canonical: '/',
		languages: {
			'en-US': '/en-US'
		}
	},
	openGraph: {
		title,
		description,
		url: 'maige.app',
		siteName: title,
		type: 'website'
	},
	twitter: {
		title,
		creator: '@RubricLabs',
		card: 'summary_large_image',
		description
	}
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${jakarta.variable}${monocraft.variable}${roboto.variable}`}>
			<body>
				<Providers>
					<main>{children}</main>
				</Providers>
			</body>
		</html>
	)
}
