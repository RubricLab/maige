import { redirect } from 'next/navigation'

export default async function Settings({ params }: { params: { slug: string } }) {
	redirect(`/${params.slug}/settings/members`)
}
