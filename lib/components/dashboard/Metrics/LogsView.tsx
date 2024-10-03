import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '~/components/ui/table'
import prisma from '~/prisma'
import { cn } from '~/utils'
import type { RunLog } from './TableWrapper'

type Props = {
	runId: string
}

export default async function LogsView({ runId }: Props) {
	const logs = await prisma.log.findMany({
		where: {
			runId: runId
		}
	})

	const TableColNames = [
		'Agent',
		'Action',
		'Model',
		'Total Tokens',
		'Status',
		'Created At',
		'Finished At',
		'Time Taken'
	]

	return (
		<Table>
			<TableHeader>
				<TableRow>
					{TableColNames.map((colName, i) => (
						<TableHead className={cn({ 'text-right': i === TableColNames.length - 1 })} key={colName}>
							{colName}
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{logs?.length === 0 && (
					<TableRow>
						<TableCell colSpan={8} className="py-6 text-center">
							No logs found
						</TableCell>
					</TableRow>
				)}
				{(logs as RunLog[]).map((log: RunLog) => {
					return (
						<TableRow key={log.id}>
							<TableCell>
								<span className="rounded-sm border border-blue-600 bg-blue-400/60 px-2 py-1 font-medium text-xs capitalize dark:bg-blue-700/60">
									{log.agent}
								</span>
							</TableCell>
							<TableCell>
								<span className={cn({ 'opacity-30': log.action === 'Coming Soon' })}>{log.action}</span>
							</TableCell>
							<TableCell>{log.model}</TableCell>
							<TableCell>{log.totalTokens}</TableCell>
							<TableCell>
								<span
									className={cn(
										{
											'border-green-600/80 bg-green-400/60 dark:bg-green-700/60': log.status === 'completed',
											'border-red-600/80 bg-green-400/60 dark:bg-red-700/60': log.status === 'failed',
											'border-yellow-600/80 bg-green-400/60 dark:bg-yellow-700/60':
												log.status === 'in_progress'
										},
										'rounded-sm border px-2 py-1 font-medium text-xs capitalize'
									)}
								>
									{log.status.replace('_', ' ')}
								</span>
							</TableCell>
							<TableCell>
								{log.createdAt.toLocaleString('en-US', {
									year: 'numeric',
									month: 'short',
									day: 'numeric',
									hour: 'numeric',
									minute: '2-digit',
									second: '2-digit'
								})}
							</TableCell>
							<TableCell>
								{log.finishedAt?.toLocaleString('en-US', {
									hour: 'numeric',
									minute: '2-digit',
									second: '2-digit'
								}) ?? 'N/A'}
							</TableCell>
							<TableCell className="text-right">
								{log.finishedAt
									? `${((log.finishedAt?.getTime() - log.createdAt.getTime()) / 1000).toFixed(2)}s`
									: '...'}
							</TableCell>
						</TableRow>
					)
				})}
			</TableBody>
		</Table>
	)
}
