import config from '@rubriclab/tailwind-config'
import {Config} from 'tailwindcss'

const tailwindConfig = {
	content: ['./src/**/*.tsx'],
	presets: [config]
} satisfies Config

export default tailwindConfig
