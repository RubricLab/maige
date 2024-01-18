import {Plus_Jakarta_Sans, Roboto} from 'next/font/google'

// Applied using variable name
export const jakarta = Plus_Jakarta_Sans({
	subsets: ['latin'],
	display: 'swap',
	weight: ['400', '700'],
	variable: '--font-jakarta'
})

// Applied globally
export const roboto = Roboto({
	subsets: ['latin'],
	display: 'swap',
	weight: ['100', '400', '700']
})
