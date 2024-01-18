import {Skeleton} from '~/components/ui/skeleton'

type Props = {}

export default function Loading({}: Props) {
	return (
		<div className='space-y-2'>
			<Skeleton className='h-10' />
			<Skeleton className='h-56' />
		</div>
	)
}
