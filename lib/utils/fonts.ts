import {Italiana, Roboto} from 'next/font/google'

// Applied using variable name
export const italiana = Italiana({
	subsets: ['latin'],
	display: 'swap',
	weight: '400',
	variable: '--font-italiana'
})

// Applied globally
export const roboto = Roboto({
	subsets: ['latin'],
	display: 'swap',
	weight: ['100', '400', '700']
})
