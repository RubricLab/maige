import {Cal, Documenso, Highlight, Nuxt, Precedent, Trigger} from './'

export const Logos = () => {
	return (
		<>
			<p className='text-tertiary font-monocraft'>Used by 2.4k++ repos:</p>
			<div className='center gap-12 sm:gap-14'>
				<Documenso className='h-8 opacity-60 transition-opacity hover:opacity-100' />
				<Nuxt className='h-8 opacity-60 transition-opacity hover:opacity-100' />
				<Highlight className='h-9 opacity-60 transition-opacity hover:opacity-100' />
				<Cal className='h-8 opacity-60 transition-opacity hover:opacity-100' />
				<Trigger className='h-9 opacity-60 transition-opacity hover:opacity-100' />
				<Precedent className='h-9 opacity-60 transition-opacity hover:opacity-100' />
			</div>
		</>
	)
}
