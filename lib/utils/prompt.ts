import {Instruction} from '@prisma/client'
import {Issue, Label, Repository} from '~/types'

export function getPromptForIssue({
	repo,
	issue,
	labels,
	instructions
}: {
	repo: Repository
	issue: Issue
	labels: Label[]
	instructions: Instruction[]
}) {
	return `
    Hey, here's an incoming issue.
    First, some context:
    Repository full name: ${repo.owner}/${repo.name}.
    Repository description: ${repo.description}.
    Issue number: ${issue.number}.
    Issue title: ${issue.title}.
    Issue body: ${issue.body}.
    Issue labels: ${labels}.
    Your instructions: ${instructions || 'do nothing'}.
    `.replaceAll('\n', ' ')
}
