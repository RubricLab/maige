/** @type {import('tailwindcss').Config} */
import config from '@rubriclab/tailwind-config'
import colors from 'tailwindcss/colors'

module.exports = {
	presets: [config],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
		'./lib/**/*.tsx',
		'./node_modules/@tremor/**/*.{js,ts,jsx,tsx}'
	],
	prefix: '',
	theme: {
		extend: {
			colors: {
				gray: {
					...colors.neutral
				},
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				tremor: {
					brand: {
						faint: 'transparent',
						muted: colors.blue[950],
						subtle: colors.blue[800],
						DEFAULT: colors.blue[200],
						emphasis: colors.blue[400],
						inverted: colors.blue[950]
					},
					background: {
						muted: 'transparent',
						subtle: colors.neutral[800],
						DEFAULT: colors.neutral[800],
						emphasis: colors.neutral[800]
					},
					border: {
						DEFAULT: colors.neutral[800]
					},
					ring: {
						DEFAULT: colors.neutral[800]
					},
					content: {
						subtle: colors.red[800],
						DEFAULT: colors.neutral[200],
						emphasis: colors.neutral[200],
						strong: colors.neutral[800],
						inverted: colors.neutral[850]
					}
				}
			},
			boxShadow: {
				// light
				'tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
				'tremor-card':
					'0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
				'tremor-dropdown':
					'0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
				// dark
				'dark-tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
				'dark-tremor-card':
					'0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
				'dark-tremor-dropdown':
					'0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
			},
			borderRadius: {
				'4xl': '2rem',
				'5xl': '2.5rem',
				'tremor-small': '0.375rem',
				'tremor-default': '0.5rem',
				'tremor-full': '9999px'
			},
			fontFamily: {
				monocraft: ['var(--font-monocraft)'],
				jakarta: ['var(--font-jakarta)'],
				roboto: ['var(--font-roboto)']
			},
			keyframes: {
				'accordion-down': {
					from: {height: '0'},
					to: {height: 'var(--radix-accordion-content-height)'}
				},
				'accordion-up': {
					from: {height: 'var(--radix-accordion-content-height)'},
					to: {height: '0'}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			fontSize: {
				'tremor-label': ['0.75rem'],
				'tremor-default': ['0.875rem', {lineHeight: '1.25rem'}],
				'tremor-title': ['1.125rem', {lineHeight: '1.75rem'}],
				'tremor-metric': ['1.875rem', {lineHeight: '2.25rem'}]
			},
			dropShadow: {
				glow: [
					'0 0px 20px rgba(255,255, 255, 0.35)',
					'0 0px 65px rgba(255, 255,255, 0.2)'
				]
			}
		}
	},
	safelist: [
		{
			pattern:
				/^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
			variants: ['hover', 'ui-selected']
		},
		{
			pattern:
				/^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
			variants: ['hover', 'ui-selected']
		},
		{
			pattern:
				/^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
			variants: ['hover', 'ui-selected']
		},
		{
			pattern:
				/^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/
		},
		{
			pattern:
				/^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/
		},
		{
			pattern:
				/^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/
		}
	],
	plugins: [require('tailwindcss-animate'), require('@headlessui/tailwindcss')]
}
