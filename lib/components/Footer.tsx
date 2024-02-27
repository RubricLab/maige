import Link from 'next/link'

export const Footer = () => {
	return (
		<footer className='flex w-screen items-end justify-center space-x-0.5 p-10 font-monocraft text-green-600 dark:text-green-100'>
			<span>an</span>
			<Link
				className='underline'
				href='https://github.com/RubricLab/maige'
				target='_blank'>
				open source experiment
			</Link>
			<span>by</span>
			<Link
				className='underline'
				href='https://rubriclabs.com'
				target='_blank'>
				Rubric Labs
			</Link>
		</footer>
	)
}
