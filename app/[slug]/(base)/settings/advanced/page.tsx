import { DeleteTeam } from '~/components/dashboard/Settings'

export default function AdvancedSettings() {
	return (
		<div className="flex flex-col gap-4">
			<h3>Advanced</h3>
			<DeleteTeam />
		</div>
	)
}
