import {DashboardHeader} from '~/components/dashboard/Navigation/Header'
import {authOptions} from '~/authOptions'
import {getServerSession} from 'next-auth'
import BackgroundGrid from '~/components/background-grid'

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    return (
        <div className='relative min-h-screen w-full bg-black px-8 text-white'>
             <BackgroundGrid className='absolute opacity-40 h-full w-full left-0 right-0 z-0' />
            {session && <DashboardHeader
					session={session}
					avatarUrl={session.user.image}
				/>}
            {children}
        </div>
    )
}