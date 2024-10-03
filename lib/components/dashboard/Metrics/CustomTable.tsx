import {
	ArrowTopRightIcon,
	CaretSortIcon,
	ChevronDownIcon,
	ChevronUpIcon
} from '@radix-ui/react-icons'
import Link from 'next/link'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '~/components/ui/table'
import { cn } from '~/utils'
import DialogWrapper from './DialogWrapper'
import LogsView from './LogsView'
import type { RunRow } from './TableWrapper'

const excludedCols = ['project', 'timeTaken', 'logs']

const TableColNames = [
	{
		key: 'project',
		value: 'Project',
		align: 'left'
	},
	{
		key: 'issueNum',
		value: 'Issue #',
		align: 'left'
	},
	{
		key: 'createdAt',
		value: 'Created',
		align: 'right'
	},
	{
		key: 'finishedAt',
		value: 'Finished',
		align: 'right'
	},
	{
		key: 'timeTaken',
		value: 'Time Taken',
		align: 'right'
	},
	{
		key: 'logs',
		value: 'Logs',
		align: 'right'
	}
]

export function CustomTable({
	data,
	params,
	teamSlug,
	route
}: {
	data: RunRow[]
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	params: any
	teamSlug: string
	route: string
}) {
	return (
		<Table>
			<TableHeader>
				<TableRow className="!border-b-2">
					{TableColNames.map(col => {
						const searchParams = new URLSearchParams(params)
						if (!excludedCols.includes(col.key)) {
							searchParams.set('dir', col.key === params.col && params.dir === 'asc' ? 'desc' : 'asc')
							searchParams.set('col', col.key)
						}
						const href = `/${teamSlug}/usage/${route}?${searchParams.toString()}`

						return (
							<TableHead key={col.key} className={`${col.align === 'right' ? 'text-right' : ''}`}>
								<Link
									prefetch={false}
									href={href}
									className={cn('inline-flex items-center', {
										'pointer-events-none': excludedCols.includes(col.key)
									})}
								>
									{col.value}{' '}
									{!excludedCols.includes(col.key) &&
										(params.col === col.key ? (
											params.dir === 'asc' ? (
												<ChevronUpIcon className="ml-2 h-4 w-4" />
											) : (
												<ChevronDownIcon className="ml-2 h-4 w-4" />
											)
										) : (
											<CaretSortIcon className="ml-2 h-4 w-4" />
										))}
								</Link>
							</TableHead>
						)
					})}
				</TableRow>
			</TableHeader>
			<TableBody>
				{data?.length === 0 && (
					<TableRow>
						<TableCell colSpan={6} className="py-6 text-center">
							No runs found
						</TableCell>
					</TableRow>
				)}
				{data.map(usage => (
					<TableRow key={usage.id}>
						<TableCell className="group font-medium">
							<Link
								href={`project/${usage.project.id}`}
								className="inline-flex items-center justify-between gap-1.5"
							>
								{usage.project.name}{' '}
								<ArrowTopRightIcon className="opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100" />
							</Link>
						</TableCell>
						<TableCell className="group text-left font-medium">
							<Link
								target="_blank"
								href={usage.issueUrl}
								className="inline-flex items-center justify-between gap-1.5"
							>
								{usage.issueNum}{' '}
								<ArrowTopRightIcon className="opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100" />
							</Link>
						</TableCell>
						<TableCell className="text-right">
							{usage.createdAt.toLocaleString('en-US', {
								year: '2-digit',
								month: 'short',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit',
								second: '2-digit'
							})}
						</TableCell>
						<TableCell className="text-right">
							{usage.finishedAt?.toLocaleString('en-US', {
								year: '2-digit',
								month: 'short',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit',
								second: '2-digit'
							}) ?? 'N/A'}
						</TableCell>
						<TableCell className="text-right">
							{usage.finishedAt
								? `${((usage.finishedAt?.getTime() - usage.createdAt.getTime()) / 1000).toFixed(2)}s`
								: '...'}
						</TableCell>
						<TableCell className="flex items-center justify-end text-right">
							<DialogWrapper title={'Run Logs'} runId={usage.id}>
								<LogsView runId={usage.id} />
							</DialogWrapper>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
