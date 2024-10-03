import type { User } from "next-auth";
import type * as React from "react";

interface EmailTemplateProps {
	user: User;
	teamName: string;
	inviteId: string;
	domain: string;
}

export const InviteMember: React.FC<Readonly<EmailTemplateProps>> = ({
	user,
	teamName,
	inviteId,
	domain,
}) => (
	<div>
		<h1>
			{user.name ?? user.userName} has invited you to join {teamName} on Maige
		</h1>
		<p>
			<a href={`https://${domain}`}>Maige</a> is open-source infrastructure for
			running natural language workflows on your GitHub codebase.
		</p>
		<a href={`https://${domain}/invite/${inviteId}`}>Accept invite</a>
		<p>Or paste this link into your browser</p>
		<p>{`https://${domain}/invite/${inviteId}`}</p>
	</div>
);
