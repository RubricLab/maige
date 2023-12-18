export default async function getFiles(
	filePaths: string[],
	repoUrl: string,
	branch: string = 'main'
) {
    const repoPath = repoUrl.split('https://github.com/')[1].split('/')
	const repoName = repoPath[1]
	const repoOwner = repoPath[0]

    //TODO: Add Type
	const promises: any[] = []
	for (const filePath of filePaths) {
		const res = await fetch(
			`https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${filePath}`
		)
		if (res.ok === false) {
			console.error(`File ${filePath} not found in ${repoUrl} on branch ${branch}`)
			continue
		}
		const fileContent = await res.text()
		promises.push({
			contents: fileContent || '',
			metadata: {
				source: filePath,
				repository: repoUrl,
				branch: branch
			}
		})
	}
	return promises
}
