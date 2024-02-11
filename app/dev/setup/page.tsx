import {createPrivateKey} from 'crypto'
import Link from 'next/link'
import {Button} from '~/components/ui/button'
import {CopyTextButton} from '~/components/ui/copy-text-button'
import {Input} from '~/components/ui/input'
import env from '~/env.mjs'

/**
 * To generate a GitHub App for self-hosting or development
 */
export default async function Page({
	searchParams
}: {
	searchParams: {code?: string; 'public-url'?: string}
}) {
	const code = searchParams.code
	const publicUrl = searchParams['public-url'] || 'https://replace-me.ngrok.app'
	
	let data: any
	let dataString = ''

	if (code) {
		const res = await fetch(
			`https://api.github.com/app-manifests/${code}/conversions`,
			{
				method: 'POST',
				headers: {
					Accept: 'application/vnd.github.v3+json',
					'X-GitHub-Api-Version': '2022-11-28'
				}
			}
		)

		if (res.status > 201)
			return (
				<div className='space-y-4 text-center'>
					<h3>Something went wrong</h3>
					<Button>
						<Link href='/dev/setup'>Try again</Link>
					</Button>
				</div>
			)

		data = await res.json()

		// Translate the private key to PKCS8 format
		const keyObject = createPrivateKey({key: data.pem, format: 'pem'})
		const privateKeyPKCS = keyObject.export({type: 'pkcs8', format: 'pem'})
		data.pem = privateKeyPKCS

		// Combine env vars into a copy-friendly string
		dataString = `
			NEXT_PUBLIC_GITHUB_APP_NAME='${data.name}'
			GITHUB_APP_ID='${data.id}'
			GITHUB_CLIENT_ID='${data.client_id}'
			GITHUB_CLIENT_SECRET='${data.client_secret}'
			GITHUB_WEBHOOK_SECRET='${data.webhook_secret}'
			GITHUB_PRIVATE_KEY='${data.pem}'
		`.replaceAll('\t', '')
	}

	const devUrl = env.NEXTAUTH_URL || 'http://localhost:3000'
	const uuid = crypto.randomUUID().slice(0, 7)
	const config = {
		name: `maige-dev-${uuid}`,
		url: 'https://maige.app',
		hook_attributes: {
			url: `${publicUrl}/api/webhook/github`
		},
		redirect_url: `${devUrl}/dev/setup`,
		callback_urls: [`${publicUrl}/api/auth/callback/github`],
		public: true,
		default_permissions: {
			contents: 'write',
			issues: 'write',
			metadata: 'read',
			pull_requests: 'write'
		},
		default_events: ['issues', 'issue_comment', 'pull_request']
	}

	return (
		<div className='flex flex-col gap-4 text-center'>
			{data ? (
				<>
					<h3>Success!</h3>
					<p>
						Copy this to your <span className='font-semibold'>.env.local</span>:
					</p>
					<code className='bg-tertiary flex flex-col space-y-1 rounded-sm p-3 text-left text-xs'>
						<span>NEXT_PUBLIC_GITHUB_APP_NAME={data.name}</span>
						<span>GITHUB_APP_ID={data.id}</span>
						<span>GITHUB_CLIENT_ID={data.client_id}</span>
						<span>GITHUB_CLIENT_SECRET={data.client_secret}</span>
						<span>GITHUB_WEBHOOK_SECRET={data.webhook_secret}</span>
						<span>GITHUB_PRIVATE_KEY={data.pem}</span>
					</code>
					<CopyTextButton
						className='ml-auto w-fit'
						text={dataString}
					/>
				</>
			) : publicUrl ? (
				<>
					<h3>Great! Now let&apos;s generate your GitHub app.</h3>
					<p>You&apos;ll get redirect back here.</p>
					<form
						action='https://github.com/settings/apps/new'
						method='post'>
						<input
							type='text'
							name='manifest'
							hidden
							readOnly
							value={JSON.stringify(config)}
						/>
						<Button>Generate App</Button>
					</form>
				</>
			) : (
				<>
					<h3>First, enter your public URL.</h3>
					<p>
						Run <code className='rounded-sm p-1 text-sm'>ngrok http 3000</code> to get
						a public URL (see README).
					</p>
					<form
						className='space-y-4'
						action='/dev/setup'
						method='get'>
						<Input
							type='text'
							name='public-url'
							placeholder='https://abc123.ngrok.app'
						/>
						<Button>Register URL</Button>
					</form>
				</>
			)}
		</div>
	)
}
