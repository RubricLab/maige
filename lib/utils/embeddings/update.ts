import { Document } from 'langchain/document'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { WeaviateStore } from 'langchain/vectorstores/weaviate'
import { getInstallationId, getInstallationToken } from '~/utils/github'
import { type WeaviateConfig } from './db'
import deleteFiles from './deleteFiles'
import getFiles from './get'

type WeaviateDocument = Document & {
	metadata: Document['metadata'] & {
		userId: string
		ext: string
	}
}

export default async function updateRepo(
	weaviateConfig: WeaviateConfig,
	repoFullName: string,
	repoUrl: string,
	commitId: string,
	branch: string,
	octokit: any
) {
	const textSplitter = new RecursiveCharacterTextSplitter({
		chunkSize: 4000,
		chunkOverlap: 250
	})

	const repoPath = repoUrl.split('https://github.com/')[1].split('/')
	const repoName = repoPath[1]
	const repoOwner = repoPath[0]

	const installationToken = await getInstallationToken(
		await getInstallationId(repoFullName)
	)

	try {
		const data = await octokit.request(
			'GET /repos/{owner}/{repo}/commits/{ref}',
			{
				owner: repoOwner,
				repo: repoName,
				ref: commitId,
				headers: {
					'X-GitHub-Api-Version': '2022-11-28'
				}
			}
		)

		// Filter to files that were modified or deleted
		const modifiedFiles = data.data.files.filter(
			file => file.status !== 'added'
		)

		// Filter to files that were modified or added
		const remainingFiles = data.data.files.filter(
			file => file.status !== 'removed'
		)

		// If any files were deleted, delete them from Weaviate
		if (modifiedFiles.length > 0)
			await deleteFiles(
				weaviateConfig,
				repoUrl,
				modifiedFiles.map(file => file.filename),
				branch
			)


		// If no files were added or modified, return early
		if (remainingFiles.length === 0)
			return []


		const files = await getFiles(
			remainingFiles,
			repoUrl,
			branch,
			installationToken
		)

		const documents = await Promise.all(
			files.map(async (file: Promise<Document>) => {
				try {
					const { pageContent, metadata } = await file
					return new Document({
						pageContent: pageContent || '',
						metadata
					})
				} catch (e) {
					console.error(e)
					return null
				}
			})
		)

		const snippets = await textSplitter.splitDocuments(documents)

		const docs: WeaviateDocument[] = snippets.map(doc => ({
			...doc,
			metadata: {
				...doc.metadata,
				userId: weaviateConfig.userId,
				ext: doc.metadata.source.split('.')[1] || ''
			}
		}))

		const embeddings = new OpenAIEmbeddings({
			openAIApiKey: process.env.OPENAI_API_KEY,
			modelName: 'text-embedding-3-small'
		})

		const store = await WeaviateStore.fromExistingIndex(embeddings, {
			// "as any" is required for langchain
			client: weaviateConfig.client as any,
			indexName: weaviateConfig.indexName
		})

		// Returns the Weaviate IDs of the added documents
		const res = await store.addDocuments(docs)

		return res
	} catch (e) {
		console.error(e)
		return
	}
}
