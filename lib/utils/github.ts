import Stripe from 'stripe'
import {Label} from '~/types'
import {createPaymentLink} from '~/utils/payment'

/**
 * Add comment to issue
 */
export async function addComment({
	octokit,
	issueId,
	comment
}: {
	octokit: any
	issueId: string
	comment: string
}): Promise<string> {
	const commentResult = await octokit.graphql(
		`
    mutation($issueId: ID!, $comment: String!) {
      addComment(input: { subjectId: $issueId, body: $comment }) {
        clientMutationId
      }
    }
    `,
		{
			issueId,
			comment
		}
	)

	if (!commentResult) throw new Error('Could not add comment')

	return commentResult
}

/**
 * Label an issue
 */
export async function labelIssue({
	octokit,
	labelNames,
	allLabels,
	issueId
}: {
	octokit: any
	labelNames: string[]
	allLabels: Label[]
	issueId: string
}) {
	const labelIds = allLabels
		.filter(label => labelNames.includes(label.name))
		.map(label => label.id)

	const labelResult = await octokit.graphql(
		`
    mutation AddLabels($issueId: ID!, $labelIds: [ID!]!) {
      addLabelsToLabelable(input: {
        labelIds: $labelIds, labelableId: $issueId
      }) {
        labelable {
          labels(first:10) {
            nodes {
              name
            }
          }
        }
      }
    }
    `,
		{
			issueId,
			labelIds
		}
	)

	if (!labelResult) throw new Error('Could not add labels')

	return labelResult
}

/**
 * Open issue to prompt user to add payment info
 */
export async function openUsageIssue(
	stripe: Stripe,
	octokit: any,
	customerId: string,
	repoId: string
) {
	const paymentLink = await createPaymentLink(stripe, customerId, 'base')
	const warningIssue = await octokit.graphql(
		`
      mutation($repoId: ID!, $title: String!, $body: String!) {
        createIssue(input: { repositoryId: $repoId, title: $title, body: $body }) {
          issue {
            id
          }
        }
      }
      `,
		{
			repoId,
			title: 'Maige Usage',
			body:
				'Thanks for trying [Maige](https://maige.app).\n\n' +
				'Running GPT-based services is pricey. At this point, we ask you to add payment info to continue using Maige.\n\n' +
				`[Add payment info](${paymentLink})\n\n` +
				'Feel free to close this issue.'
		}
	)

	if (!warningIssue) {
		console.warn('Failed to open usage issue')
		throw new Error('Failed to open usage issue.')
	}
}

/**
 * Get main branch of a repo
 */
export const getMainBranch = async (repoFullName: string) => {
	const repoRes = await fetch(`https://api.github.com/repos/${repoFullName}`)
	const repo = (await repoRes.json()) as any
	const branchName = repo.default_branch

	return branchName
}
