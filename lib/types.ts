import {TIERS} from './constants'

export type Label = {
	id: string
	name: string
	description: string
}

export type Repository = {
	id: string
	name: string
	full_name: string
	private: boolean
}

export type Tier = keyof typeof TIERS
