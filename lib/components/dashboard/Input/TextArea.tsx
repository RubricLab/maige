export function TextArea({
	value,
	onTextChange
}: {
	value: string
	onTextChange: (val: string) => void
}) {
	return (
		<textarea
			name={name}
			className='bg-panel border-panel-border rounded-lg border-2 p-2 text-white focus:outline-none'
			value={value}
			onChange={e => onTextChange(e.target.value)}></textarea>
	)
}
