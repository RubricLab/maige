export function TextArea({
	value,
	onTextChange
}: {
	value: string
	onTextChange: (val: string) => void
}) {
	return (
		<textarea
			className='text-primary bg-primary w-full rounded-sm border p-2 focus:outline-none'
			value={value}
			onChange={e => onTextChange((e.target as any).value)}></textarea>
	)
}
