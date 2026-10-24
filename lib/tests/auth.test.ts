import { beforeEach, describe, expect, mock, test } from 'bun:test'
import type { Prisma } from '@prisma/client'
import type { Account } from 'next-auth'

const user = {
	id: 'existing-user',
	userName: 'alice',
	githubUserId: '123',
	email: 'alice@example.com',
	emailVerified: null,
	usage: 0
}
const account: Account = { provider: 'github', providerAccountId: '123', type: 'oauth' }
const prisma = {
	account: {
		findUnique: mock(
			async (_args: Prisma.AccountFindUniqueArgs): Promise<{ user: typeof user } | null> => null
		)
	},
	user: {
		findUnique: mock(async (_args: Prisma.UserFindUniqueArgs): Promise<typeof user | null> => null),
		update: mock(async (_args: Prisma.UserUpdateArgs) => user),
		create: mock(),
		upsert: mock()
	}
}
mock.module('~/prisma', () => ({ default: prisma }))
mock.module('~/env', () => ({
	default: { GITHUB_CLIENT_ID: 'test', GITHUB_CLIENT_SECRET: 'test' }
}))

describe('closed signups', async () => {
	const { authOptions } = await import('~/authOptions')
	const signIn = authOptions.callbacks?.signIn
	const createUser = authOptions.adapter?.createUser
	if (!signIn || !createUser) throw new Error('Missing auth callbacks')

	beforeEach(() => {
		for (const model of Object.values(prisma))
			for (const method of Object.values(model)) method.mockClear()
	})

	test('new GitHub users are redirected before any user writes', async () => {
		expect(await signIn({ user, account })).toBe('/signups-closed')
		expect(prisma.user.update).not.toHaveBeenCalled()
		expect(prisma.user.create).not.toHaveBeenCalled()
		expect(prisma.user.upsert).not.toHaveBeenCalled()
	})

	test('linked users can sign in even after changing their GitHub username', async () => {
		prisma.account.findUnique.mockResolvedValueOnce({ user })
		expect(await signIn({ user: { ...user, userName: 'renamed' }, account })).toBe(true)
		expect(prisma.account.findUnique).toHaveBeenCalledWith({
			where: { provider_providerAccountId: { provider: 'github', providerAccountId: '123' } },
			include: { user: true }
		})
		expect(prisma.user.findUnique).not.toHaveBeenCalled()
	})

	test('legacy users can sign in and migrate without creating a user', async () => {
		prisma.user.findUnique.mockResolvedValueOnce(user)
		expect(await signIn({ user, account })).toBe(true)
		expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { userName: 'alice' } })
		expect(await createUser(user)).toEqual(user)
		expect(prisma.user.update).toHaveBeenCalledWith({ where: { userName: 'alice' }, data: user })
		expect(prisma.user.create).not.toHaveBeenCalled()
		expect(prisma.user.upsert).not.toHaveBeenCalled()
	})

	test('adapter cannot create users even if the sign-in callback is bypassed', async () => {
		prisma.user.update.mockRejectedValueOnce(new Error('Record to update not found'))
		await expect(createUser({ ...user, id: 'new-user', userName: 'new' })).rejects.toThrow(
			'Record to update not found'
		)
		expect(prisma.user.create).not.toHaveBeenCalled()
		expect(prisma.user.upsert).not.toHaveBeenCalled()
	})

	test('missing GitHub account or username cannot bypass the signup block', async () => {
		expect(await signIn({ user, account: null })).toBe('/signups-closed')
		expect(await signIn({ user: { ...user, userName: null }, account })).toBe('/signups-closed')
		expect(prisma.user.findUnique).not.toHaveBeenCalled()
	})
})
