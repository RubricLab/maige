import {Document} from 'langchain/document'
import {GithubRepoLoader} from 'langchain/document_loaders/web/github'

export const excludeFiles: RegExp[] = [
	// File
	/^package-lock\.json$/,
	/^yarn\.lock$/,
	/^pnpm-lock\.yaml$/,
	/^bun\.lockb$/,
	/^\.DS_Store$/,
	// Folders
	/^.git\/(.+)/,
	/^node_modules\/(.+)/,
	/^assets\/(.+)/,
	/^public\/(.+)/,
	/^cache\/(.+)/, // TODO: find a better way to ignore cache folders
	// Images
	/\.jpg$/,
	/\.jpeg$/,
	/\.png$/,
	/\.gif$/,
	/\.bmp$/,
	/\.pdf$/,
	/\.tiff$/,
	/\.webp$/,
	/\.ico$/,
	/\.icns$/,
	// Audio
	/\.mp3$/,
	/\.wav$/,
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
	/\.pak$/
	// TODO: find a way to ignore files > 1 MB or some limit
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
		unknown: 'error',
		ignoreFiles: excludeFiles,
		accessToken: accessToken || ''
	})

	const repo = await loader.loadAndSplit(splitter)

	console.log(`Loaded ${repoUrl}: ${repo.length} documents`)

	return repo
}
