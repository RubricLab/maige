import {TIERS} from '~/constants'

export type Label = {
	id: string
	name: string
	description: string
}

export type Repository = {
	id: number
	node_id: string
	name: string
	full_name: string
	private: boolean
	owner?: string
	description?: string
}

export type Issue = {
	id: number
	number: number
	title: string
	body: string
}

export type Tier = keyof typeof TIERS
