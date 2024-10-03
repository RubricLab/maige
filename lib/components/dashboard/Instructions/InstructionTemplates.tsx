"use client";

import { PlusIcon } from "lucide-react";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

function Template({
	title,
	content,
	setContent,
}: {
	title: string;
	content: string;
	setContent: (content: string) => void;
}) {
	const [selected, setSelected] = useState(false);

	useEffect(() => {
		if (selected) setTimeout(() => setSelected(false), 1 * 1000);
	}, [selected]);

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div
			className={`flex cursor-pointer items-center gap-2 rounded-sm border border-tertiary p-2 hover:bg-tertiary ${selected ? "bg-tertiary" : ""}`}
			onClick={() => {
				setSelected((prev) => !prev);
				setContent(content);
			}}
		>
			<PlusIcon className="h-5 w-5" />
			{title}
		</div>
	);
}

export default function InstructionTemplates({
	setContent,
}: {
	setContent: Dispatch<SetStateAction<string>>;
}) {
	const { data } = useSession();

	const {
		user: { userName },
	} = data as Session;

	const templates = [
		{
			title: "Label issues",
			content: "Label all incoming issues",
		},
		{
			title: "Assign issues",
			content: `Assign @${userName || "username"} when a UI-related issue is opened`,
		},
		{
			title: "Recommend solutions",
			content: "Comment a suggested solution to incoming issues",
		},
		{
			title: "Code Generation [beta]",
			content: "Dispatch an engineer to resolve incoming issues",
		},
	];

	return (
		<div className="flex w-full flex-col gap-2 text-secondary">
			<h3>Examples</h3>
			{templates.map(({ title, content }, i) => (
				<Template
					key={i}
					title={title}
					content={content}
					setContent={setContent}
				/>
			))}
		</div>
	);
}
