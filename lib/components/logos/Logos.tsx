import {Cal, Highlight, Precedent, Trigger} from './'

export const Logos = () => {
	return (
		<div className='flex flex-col items-center gap-2 py-8'>
			<p className='text-sm text-white/60'>Used by 1.7k+ repos</p>
			<div className='flex flex-row flex-wrap items-center justify-center gap-5 text-white/60'>
				<Highlight className='h-6 hover:text-white' />
				<Precedent className='group h-6 hover:text-white' />
				<Cal className='h-5 hover:text-white' />
				<Trigger className='h-6 hover:text-white' />
			</div>
		</div>
	)
}
