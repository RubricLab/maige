import Link from 'next/link'

export const Footer = () => {
	return (
		<footer className='absolute bottom-0 flex h-10 w-screen items-center justify-center gap-1'>
			<span className='text-xs text-white/40'>
				<Link
					className='font-medium text-white/60 transition-opacity hover:text-white/80'
					href='https://github.com/RubricLab/maige'
					target='_blank'>
					Open source
				</Link>
				.
			</span>
			<span className='text-xs text-white/40'>
				Built by{' '}
				<Link
					className='font-medium text-white/60 transition-opacity hover:text-white/80'
					href='https://github.com/RubricLab'
					target='_blank'>
					Rubric
				</Link>
				.
			</span>
		</footer>
	)
}
