import {
	ArrowRightIcon,
	CaretSortIcon,
	ChevronDownIcon,
	ChevronUpIcon
} from '@radix-ui/react-icons'
import { UsageRow } from './table-wrapper';
import Link from 'next/link'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '~/components/ui/table'
import {cn} from '~/utils'

const TableColNames = [
	{
		key: 'project',
		value: 'Project',
		align: 'left'
	},
	{
		key: 'totalTokens',
		value: 'Tokens',
		align: 'left'
	},
	{
		key: 'action',
		value: 'Action',
		align: 'left'
	},
	{
		key: 'agent',
		value: 'Agent',
		align: 'right'
	},
	{
		key: 'model',
		value: 'Model',
		align: 'right'
	},
	{
		key: 'createdAt',
		value: 'Time',
		align: 'right'
	}
]

export function CustomTable({data, params, route}: {data: UsageRow[]; params: any, route:string}) {

	return (
		<Table>
			<TableHeader className='bg-neutral-700 bg-opacity-80'>
				<TableRow className='border-none'>
					{TableColNames.map(col => {
						const searchParams = new URLSearchParams(params)
						if (col.key !== 'project') {
							searchParams.set(
								'dir',
								col.key == params.col && params.dir == 'asc' ? 'desc' : 'asc'
							)
							searchParams.set('col', col.key)
						}
						const href = `/dashboard/usage/${route}?${searchParams.toString()}`

						return (
							<TableHead
								key={col.key}
								className={`text-neutral-200 ${
									col.align === 'right' ? 'text-right' : ''
								}`}>
								<Link
									prefetch={false}
									href={href}
									className={cn('inline-flex items-center', {
										'pointer-events-none': col.key === 'project'
									})}>
									{col.value}{' '}
									{col.key !== 'project' &&
										(params.col == col.key ? (
											params.dir == 'asc' ? (
												<ChevronUpIcon className='ml-2 h-4 w-4' />
											) : (
												<ChevronDownIcon className='ml-2 h-4 w-4' />
											)
										) : (
											<CaretSortIcon className='ml-2 h-4 w-4' />
										))}
								</Link>
							</TableHead>
						)
					})}
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map(usage => (
					<TableRow key={usage.id}>
						<TableCell className='group font-medium'>
							<Link
								href={`/dashboard/repo/${usage.project.id}`}
								className='inline-flex items-center justify-between gap-2'>
								{usage.project.name}{' '}
								<ArrowRightIcon className='opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100' />
							</Link>
						</TableCell>
						<TableCell>{usage.totalTokens}</TableCell>
						<TableCell>{usage.action}</TableCell>
						<TableCell className='text-right'>{usage.agent}</TableCell>
						<TableCell className='text-right'>{usage.model}</TableCell>
						<TableCell className='text-right'>
							{usage.createdAt.toDateString()}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}