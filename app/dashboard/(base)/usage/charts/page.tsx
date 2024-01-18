import Link from 'next/link'
import {CustomTable} from '~/components/dashboard/usage/custom-table'

type Props = {}

export default async function Usage() {

  // const usage = await fetch("localhost:3000/api/usage").then(res => res.json())
  
	return (
		<div className='flex w-full flex-col gap-2'>
      {/* {JSON.stringify(usage)} */}
			{/* <div className='inline-flex flex-col justify-between gap-3 lg:flex-row lg:items-center'>
				<div className='inline-flex w-fit gap-2 rounded-md bg-green-800 bg-opacity-50 px-2 py-0.5 font-mono text-xs'>
					{' '}
					<span>
						<span className='text-green-400'>{usageNum}</span> Total Results
					</span>
					/
					<span>
						Fetched Page in{' '}
						<span className='text-green-400'>{timeTaken.toFixed(4)}</span> ms
					</span>
				</div>
				<TableSearch searchValue={usageQuery.data.q ? usageQuery.data.q : ''} />
			</div>
			<div className='flex max-w-full overflow-hidden'>
				<CustomTable
					params={usageQuery.data}
					data={usage}
				/>
			</div>
			<div className='flex justify-end space-x-2'>
				{Array.from({length: Math.ceil(usageNum / pageSize)}, (_, i) => i).map(
					i => (
						<Link
							replace={true}
							prefetch={true}
							href={`/dashboard/usage?${params}&p=${i + 1}`}
							key={i}>
							<Button
								className={cn({'bg-neutral-700': i + 1 === pageNum})}
								size='sm'
								variant='outline'>
								{i + 1}
							</Button>
						</Link>
					)
				)}
			</div> */}
		</div>
	)
}
