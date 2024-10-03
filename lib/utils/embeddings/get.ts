import { Document } from 'langchain/document'

export default async function getFiles(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	files: any,
	repoUrl: string,
	branch: string,
	accessToken?: string
) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const filePromises: Promise<Document>[] = files.map((file: any) =>
		fetch(file.contents_url, {
			method: 'GET',
			headers: {
				Authorization: accessToken ? `token ${accessToken}` : undefined
			} as HeadersInit
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
