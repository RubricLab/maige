export default async function getFiles(
	files: any,
	repoUrl: string,
	branch: string,
	accessToken?: string
) {

	const promises: any[] = []
	for (const file of files) {
		const res = await fetch(file.contents_url, {
			method: 'GET',
			headers: {
				Authorization: `token ${accessToken}`
			}
		}).then(res =>
			res.json().then(data => {
				return fetch(data.download_url)
			})
		)

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
