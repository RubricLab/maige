import Link from 'next/link'

export default function SignupsClosed() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
			<h1>New signups are closed</h1>
			<p>Maige is not accepting new accounts. Existing users can still sign in.</p>
			<Link href="/" className="underline">
				Back to Maige
			</Link>
		</div>
	)
}
