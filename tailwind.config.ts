import config from '@rubriclab/tailwind-config'
import {Config} from 'tailwindcss'

const tailwindConfig = {
	content: ['./app/**/*.tsx', './lib/**/*.tsx'],
	presets: [config],
	theme: {
		extend: {
			colors: {
				panel: '#0A0A0A',
				'panel-border': '#171717',
				grey: '#555555'
			}
		}
	}
} satisfies Config

export default tailwindConfig
