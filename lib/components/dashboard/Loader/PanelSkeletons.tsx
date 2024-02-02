'use client'

import {motion} from 'framer-motion'

export function PanelSkeletons({amount}: {amount: number}) {
	return (
		<div className='flex flex-col items-center gap-8'>
			{new Array(amount).fill(null).map((_scratch, i) => (
				<motion.div
					key={i}
					className='bg-primary h-[200px] w-[400px] rounded-lg border-2'
					animate={{opacity: 0.8}}
					transition={{
						from: 1,
						duration: 1,
						repeat: Infinity,
						repeatType: 'loop'
					}}
				/>
			))}
		</div>
	)
}
