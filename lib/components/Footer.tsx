import Link from 'next/link'

export const Footer = () => {
	return (
		<footer className='flex w-screen items-end justify-center space-x-0.5 p-20'>
			<span>An open source</span>
			<Link
				className='underline'
				href='https://github.com/RubricLab/maige'
				target='_blank'>
				experiment
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
