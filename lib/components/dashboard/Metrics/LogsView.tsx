import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '~/components/ui/table'
import prisma from '~/prisma'
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
				{logs.map((log: RunLog) => {
					return (
						<TableRow key={log.id}>
							<TableCell>{log.agent}</TableCell>
							<TableCell>{log.action}</TableCell>
							<TableCell>{log.model}</TableCell>
							<TableCell>{log.totalTokens}</TableCell>
							<TableCell>{log.status}</TableCell>
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
