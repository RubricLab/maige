export function TextArea({
	value,
	onTextChange
}: {
	value: string
	onTextChange: (val: string) => void
}) {
	return (
		<textarea
			className='w-full rounded-lg border-2 bg-primary p-2 text-white focus:outline-none'
			value={value}
			onChange={e => onTextChange((e.target as any).value)}></textarea>
	)
}
