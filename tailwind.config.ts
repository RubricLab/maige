import config from '@rubriclab/tailwind-config'
import {Config} from 'tailwindcss'

const tailwindConfig = {
	content: ['./app/**/*.tsx', './lib/**/*.tsx'],
	presets: [config]
} satisfies Config

export default tailwindConfig
