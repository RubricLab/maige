import {User} from 'next-auth/core/types'
import * as React from 'react'
import {DOMAIN} from '~/constants'

interface EmailTemplateProps {
	user: User
	teamName: string
	inviteId: string
}

export const InviteMember: React.FC<Readonly<EmailTemplateProps>> = ({
	user,
	teamName,
	inviteId
}) => (
	<div>
		<h1>
			{user.name ?? user.userName} has invited you to join {teamName} on Maige
		</h1>
		<p>
			<a href={DOMAIN.PROD}>Maige</a> is open-source infrastucture for running
			natural language workflows on your GitHub codebase.
		</p>
		<a href={DOMAIN.PROD + `/invite/${inviteId}`}>Accept invite</a>
		<p>Or paste this link into your browser</p>
		<p>{DOMAIN.PROD + `/invite/${inviteId}`}</p>
	</div>
)
