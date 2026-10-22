import { beforeEach, describe, expect, mock, test } from 'bun:test'
import { type Prisma, Role } from '@prisma/client'

const user = { id: 'user-a', userName: 'alice' }
const project = { id: 'project-a', name: 'Project A', instructions: [] }
const membership: { role: Role; team: { name: string } } = {
	role: Role.ADMIN,
	team: { name: 'Team A' }
}
const getCurrentUser = mock(async (): Promise<typeof user | undefined> => user)
const send = mock(async () => ({ error: null }))
const prisma = {
	team: { deleteMany: mock(async (_args: Prisma.TeamDeleteManyArgs) => ({ count: 1 })) },
	project: {
		findFirst: mock(
			async (_args: Prisma.ProjectFindFirstArgs): Promise<typeof project | null> => project
		)
	},
	instruction: {
		create: mock(async (_args: Prisma.InstructionCreateArgs) => ({ id: 'instruction-a' })),
		update: mock(async (_args: Prisma.InstructionUpdateArgs) => ({ id: 'instruction-a' }))
	},
	membership: {
		findFirst: mock(
			async (_args: Prisma.MembershipFindFirstArgs): Promise<typeof membership | null> => membership
		)
	},
	invite: { create: mock(async (_args: Prisma.InviteCreateArgs) => ({ id: 'invite-a' })) }
}

mock.module('~/prisma', () => ({ default: prisma }))
mock.module('~/utils/session', () => ({ getCurrentUser }))
mock.module('~/resend', () => ({ resend: { emails: { send } } }))
mock.module('~/emails/invite-member', () => ({ InviteMember: () => null }))
mock.module('next/headers', () => ({ headers: () => new Headers({ host: 'localhost' }) }))
mock.module('next/navigation', () => ({
	notFound: () => {
		throw new Error('NEXT_NOT_FOUND')
	}
}))
mock.module('~/components/dashboard/Instructions/CreateInstruction', () => ({
	default: () => null
}))
mock.module('~/components/dashboard/Instructions/InstructionCard', () => ({ default: () => null }))

describe('team access control', async () => {
	const { default: deleteTeam } = await import('~/actions/delete-team')
	const { default: createInstruction } = await import('~/actions/create-instruction')
	const { updateInstruction } = await import('~/actions/update-instruction')
	const { default: createInvitation } = await import('~/actions/create-invitation')
	const { Instructions } = await import('~/components/dashboard/Instructions/Instructions')
	const { default: Overview } = await import('../../app/[slug]/project/[projectId]/page')

	function form() {
		const data = new FormData()
		for (const [key, value] of Object.entries({
			name: 'Team A',
			slug: 'team-a',
			teamId: 'team-a-id',
			projectId: 'project-a',
			instructionId: 'instruction-a',
			content: 'Instruction',
			email: 'invitee@example.com',
			role: 'ADMIN'
		}))
			data.set(key, value)
		return data
	}

	beforeEach(() => {
		getCurrentUser.mockClear().mockResolvedValue(user)
		send.mockClear()
		for (const model of Object.values(prisma))
			for (const method of Object.values(model)) method.mockClear()
	})

	for (const action of [deleteTeam, createInstruction, updateInstruction, createInvitation]) {
		test(`${action.name} requires a session before accessing the database`, async () => {
			getCurrentUser.mockResolvedValueOnce(undefined)
			expect((await action(null, form()))?.type).toBe('error')
			for (const model of Object.values(prisma))
				for (const method of Object.values(model)) expect(method).not.toHaveBeenCalled()
		})
	}

	test('team deletion requires an admin membership in the target team in the delete query', async () => {
		prisma.team.deleteMany.mockResolvedValueOnce({ count: 0 })
		expect((await deleteTeam(null, form())).type).toBe('error')
		expect(prisma.team.deleteMany).toHaveBeenCalledWith({
			where: { slug: 'team-a', memberships: { some: { userId: user.id, role: Role.ADMIN } } }
		})
		expect((await deleteTeam(null, form())).type).toBe('success')
	})

	test('instruction creation connects only a project belonging to the current user', async () => {
		prisma.instruction.create.mockRejectedValueOnce(new Error('Project not found'))
		expect((await createInstruction(null, form()))?.type).toBe('error')
		expect(prisma.instruction.create).toHaveBeenCalledWith({
			data: {
				project: { connect: { id: project.id, team: { memberships: { some: { userId: user.id } } } } },
				content: 'Instruction',
				creatorUsername: user.userName,
				user: { connect: { id: user.id } }
			}
		})
		expect((await createInstruction(null, form()))?.type).toBe('success')
	})

	test('instruction updates include team membership in the mutation predicate', async () => {
		prisma.instruction.update.mockRejectedValueOnce(new Error('Instruction not found'))
		expect((await updateInstruction(null, form())).type).toBe('error')
		expect(prisma.instruction.update).toHaveBeenCalledWith({
			where: {
				id: 'instruction-a',
				project: { team: { memberships: { some: { userId: user.id } } } }
			},
			data: { content: 'Instruction' }
		})
		expect((await updateInstruction(null, form())).type).toBe('success')
	})

	for (const role of [null, Role.USER]) {
		test(`invitation rejects ${role ?? 'non-member'} without writing or sending email`, async () => {
			prisma.membership.findFirst.mockResolvedValueOnce(role ? { ...membership, role } : null)
			expect((await createInvitation(null, form())).type).toBe('error')
			expect(prisma.membership.findFirst).toHaveBeenCalledWith({
				where: { teamId: 'team-a-id', userId: user.id },
				include: { team: { select: { name: true } } }
			})
			expect(prisma.invite.create).not.toHaveBeenCalled()
			expect(send).not.toHaveBeenCalled()
		})
	}

	test('team admins can still invite administrators', async () => {
		expect((await createInvitation(null, form())).type).toBe('success')
		expect(prisma.invite.create).toHaveBeenCalledWith({
			data: { email: 'invitee@example.com', role: Role.ADMIN, invitedBy: user.id, teamId: 'team-a-id' }
		})
		expect(send).toHaveBeenCalledTimes(1)
	})

	for (const { name, read } of [
		{ name: 'overview', read: () => Overview({ params: { projectId: project.id, slug: 'team-a' } }) },
		{ name: 'instructions', read: () => Instructions({ projectId: project.id, teamSlug: 'team-a' }) }
	]) {
		test(`${name} rejects anonymous reads without querying projects`, async () => {
			getCurrentUser.mockResolvedValueOnce(undefined)
			await expect(read()).rejects.toThrow('NEXT_NOT_FOUND')
			expect(prisma.project.findFirst).not.toHaveBeenCalled()
		})
		test(`${name} binds project ID to both the team slug and current user's membership`, async () => {
			prisma.project.findFirst.mockResolvedValueOnce(null)
			await expect(read()).rejects.toThrow('NEXT_NOT_FOUND')
			expect(prisma.project.findFirst.mock.calls[0]?.[0]?.where).toEqual({
				id: project.id,
				team: { slug: 'team-a', memberships: { some: { userId: user.id } } }
			})
			expect(await read()).toBeDefined()
		})
	}
})
