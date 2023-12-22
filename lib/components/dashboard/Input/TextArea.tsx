export function TextArea({
	value,
	onTextChange
}: {
	value: string
	onTextChange: (val: string) => void
}) {
	return (
		<textarea
			className='bg-panel border-panel-border rounded-lg border-2 p-2 text-white focus:outline-none'
			value={value}
			onChange={e => onTextChange((e.target as any).value)}></textarea>
	)
}
