import {DashboardHeader} from '~/components/dashboard/Navigation/Header'
import {authOptions} from '~/authOptions'
import {getServerSession} from 'next-auth'

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    return (
        <div className='min-h-screen w-full bg-black px-8 text-white'>
            <DashboardHeader
					session={session}
					avatarUrl={session.user.image}
				/>
            {children}
        </div>
    )
}