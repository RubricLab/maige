import { connect } from '@planetscale/database'
import env from './env'

export const config = {
	url: env.DATABASE_URL
}

export const conn = connect(config)
