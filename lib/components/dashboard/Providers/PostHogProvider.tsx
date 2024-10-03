"use client";

import posthog from "posthog-js";
import { PostHogProvider as Provider } from "posthog-js/react";
import type { ReactNode } from "react";
import env from "~/env";

if (typeof window !== "undefined")
	posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
		api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
	});

export function PostHogProvider({ children }: { children: ReactNode }) {
	return <Provider client={posthog}>{children}</Provider>;
}
