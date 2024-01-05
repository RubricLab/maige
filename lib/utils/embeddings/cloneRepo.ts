import {Document} from 'langchain/document'
import {GithubRepoLoader} from 'langchain/document_loaders/web/github'
import {isDev} from '../index'

export const ignoreFiles: RegExp[] = [
	// File
	/^package-lock\.json$/,
	/^yarn\.lock$/,
	/^pnpm-lock\.yaml$/,
	/^bun\.lockb$/,
	/^\.DS_Store$/,
	// Images
	/\.jpg$/,
	/\.jpeg$/,
	/\.png$/,
	/\.gif$/,
	/\.mov$/,
	/\.bmp$/,
	/\.pdf$/,
	/\.tiff$/,
	/\.webp$/,
	/\.ico$/,
	/\.icns$/,
	// Fonts
	/\.woff$/,
	/\.woff2$/,
	/\.otf$/,
	/\.ttf$/,
	// Audio
	/\.mp3$/,
	/\.wav$/,
	// Video
	/\.mp4$/,
	/\.mov$/,
	// Raw datasets
	/\.pb$/,
	/\.csv$/,
	/\.parq$/,
	/\.avro$/,
	/\.parquet$/,
	/\.txt$/,
	// Miscellaneous
	/\.data-00000-of-00001$/,
	/\.patch$/,
	/\.asar$/,
	/\.manifest$/,
	/\.pak$/,
	/\.background.tsx$/
	// TODO: find a way to ignore files > 1 MB or some limit
]

const ignorePaths = [
	'**/node_modules/**',
	'**/assets/**',
	'**/public/**',
	'**/cache/**',
	'**/.vscode/**',
	'**/.yarn/**',
	'**/.git/**',
	'**/migrations/**',
	// Miscellaneous
	'**/packages/app-store*/**'
]

export async function cloneRepo(
	repoUrl: string,
	branchName: string = 'main',
	splitter: any,
	accessToken?: string | ''
): Promise<Document[]> {
	const validUrl = /^(https:\/\/github\.com\/)(.+)\/(.+)$/

	if (!validUrl.test(repoUrl)) throw new Error(`Invalid repo URL: ${repoUrl}`)

	const loader = new GithubRepoLoader(repoUrl, {
		branch: branchName,
		recursive: true,
		unknown: 'warn',
		ignoreFiles,
		ignorePaths,
		accessToken: accessToken || '',
		verbose: isDev
	})

	const repo = await loader.loadAndSplit(splitter)

	console.log(`Loaded ${repoUrl}: ${repo.length} documents`)

	return repo
}
