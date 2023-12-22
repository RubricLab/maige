import {redirect} from 'next/navigation'

export default async function Page({params}: {params: {projectId: string}}) {
	redirect(`/dashboard/${params.projectId}/instructions`)
}
