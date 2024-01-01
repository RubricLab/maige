export default async function getFiles(
	// filePaths: string[],
	repoUrl: string,
	files: any,
	branch: string
) {
    // const repoPath = repoUrl.split('https://github.com/')[1].split('/')
	// const repoName = repoPath[1]
	// const repoOwner = repoPath[0]

    //TODO: Add Type
	const promises: any[] = []
	for (const file of files) {
		// const res = await fetch(
		// 	`https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${filePath}`
		// )
		const res = await fetch(file.raw_url)
		if (res.ok === false) {
			console.error(`Could not fetch contents of ${file.filename} on main branch`)
			continue
		}
		const fileContent = await res.text()
		promises.push({
			contents: fileContent || '',
			metadata: {
				source: file.filename,
				repository: repoUrl,
				branch: branch
			}
		})
	}
	return promises
}
