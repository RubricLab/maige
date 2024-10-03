import { Skeleton } from '~/components/ui/skeleton'

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type Props = {}

// biome-ignore lint/correctness/noEmptyPattern: <explanation>
export default function Loading({}: Props) {
	return (
		<div className="space-y-2">
			<Skeleton className="h-10" />
			<Skeleton className="h-56" />
		</div>
	)
}
