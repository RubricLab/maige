import {Document} from 'langchain/document'

export default async function getFiles(
	files: any,
	repoUrl: string,
	branch: string,
	accessToken?: string
) {
	const filePromises: Promise<Document>[] = files.map((file: any) =>
		fetch(file.contents_url, {
			method: 'GET',
			headers: {
				Authorization: accessToken ? `token ${accessToken}` : undefined
			}
		})
			.then(res => res.json())
			.then(data => fetch(data.download_url))
			.then(res => res.text())
			.then(
				(fileContent: string) =>
					new Document({
						pageContent: fileContent || '',
						metadata: {
							source: file.filename,
							repository: repoUrl,
							branch: branch
						}
					})
			)
			.catch(error => {
				console.error(`Failed to fetch file ${file.filename}:`, error)
				return null
			})
	)

	return filePromises
}
