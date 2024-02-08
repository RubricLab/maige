import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '~/components/ui/table'
import prisma from '~/prisma'
import {cn} from '~/utils'
import {RunLog} from './TableWrapper'

type Props = {
	runId: string
}

export default async function LogsView({runId}: Props) {
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
					{TableColNames.map(colName => {
						return <TableHead key={colName}>{colName}</TableHead>
					})}
				</TableRow>
			</TableHeader>
			<TableBody>
				{logs?.length === 0 && (
					<TableRow>
						<TableCell colSpan={8} className='text-center py-6'>
							No logs found
						</TableCell>
					</TableRow>
				)}
				{logs.map((log: RunLog) => {
					return (
						<TableRow key={log.id}>
							<TableCell>{log.agent}</TableCell>
							<TableCell><span className={cn({"opacity-30":log.action == "Coming Soon"})}>{log.action}</span></TableCell>
							<TableCell>{log.model}</TableCell>
							<TableCell>{log.totalTokens}</TableCell>
							<TableCell>
								<span
									className={cn(
										{
											'border-green-700 bg-green-700': log.status === 'completed',
											'border-red-700 bg-red-700': log.status === 'failed',
											'border-yellow-700 bg-yellow-700': log.status === 'in_progress'
										},
										'rounded-sm border border-opacity-80 bg-opacity-60 px-2 py-1 text-xs font-medium capitalize'
									)}>
									{log.status.replace('_', ' ')}
								</span>
							</TableCell>
							<TableCell>
								{log.createdAt.toLocaleString('en-US', {
									year: '2-digit',
									month: 'short',
									day: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
									second: '2-digit'
								})}
							</TableCell>
							<TableCell>
								{log.finishedAt?.toLocaleString('en-US', {
									year: '2-digit',
									month: 'short',
									day: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
									second: '2-digit'
								}) ?? 'N/A'}
							</TableCell>
							<TableCell className='text-right'>
								{log.finishedAt
									? (
											(log.finishedAt?.getTime() - log.createdAt.getTime()) /
											1000
										).toFixed(2) + 's'
									: '...'}
							</TableCell>
						</TableRow>
					)
				})}
			</TableBody>
		</Table>
	)
}
