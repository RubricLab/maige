import {Instruction} from '@prisma/client'
import {Comment, Issue, Label, Repository} from '~/types'

export function getPrompt({
	repo,
	issue,
	labels,
	instructions,
	comment
}: {
	repo: Repository
	issue: Issue
	labels: Label[]
	instructions: Instruction[]
	comment?: Comment
}) {
	return `
    Hey, here's an incoming ${comment ? 'comment on an' : ''} issue.
    First, some context:
    Repository full name: ${repo.owner}/${repo.name}.
    Repository description: ${repo.description}.
    Issue number: ${issue.number}.
    Issue title: ${issue.title}.
    Issue body: ${issue.body}.
    Issue labels: ${labels}.
    ${comment ? `The comment by @${comment.name}: ${comment.body}.` : ''}
    Your instructions: ${instructions || 'do nothing'}.
    `.replaceAll('\n', ' ')
}
