import Image from 'next/image'
import precedentLogo from 'public/assets/logos/precedent.png'

function Precedent({className}: {className?: string}) {
	return (
		<a
			href='https://precedent.dev'
			target='_blank'
			rel='noreferrer noopener'>
			<div className={`${className} flex items-center justify-center gap-2`}>
				<Image
					alt='Precent logo'
					src={precedentLogo}
					className='max-h-full w-auto opacity-70 invert group-hover:opacity-100'
				/>
				<p className='text-2xl'>Precedent</p>
			</div>
		</a>
	)
}

export default Precedent
