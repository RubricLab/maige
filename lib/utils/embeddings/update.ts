import {Document} from 'langchain/document'
import {OpenAIEmbeddings} from 'langchain/embeddings/openai'
import {RecursiveCharacterTextSplitter} from 'langchain/text_splitter'
import {WeaviateStore} from 'langchain/vectorstores/weaviate'
import {type WeaviateConfig} from './db'
import deleteFiles from './deleteFiles'
import getFiles from './get'
import {AISummary} from './summary'

export default async function updateRepo(
	weaviateConfig: WeaviateConfig,
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

	try {
		const data = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
			owner: repoOwner,
			repo: repoName,
			ref: commitId,
			headers: {
			  'X-GitHub-Api-Version': '2022-11-28'
			}
		})
		
		const modifiedFiles = data.data.files.filter(file => file.status === 'modified')

		const del = await deleteFiles(weaviateConfig, repoUrl, modifiedFiles.map(file => file.filename), branch)
		console.log(del)

		const files = await getFiles(repoUrl, modifiedFiles, branch)

		const documents = await Promise.all(
            //TODO: Add Type
			files.map(async (fileResponse: any) => {
				const {contents, metadata} = await fileResponse
				return new Document({
					pageContent: contents,
					metadata
				})
			})
		)
		
		console.log("docs")
		console.log(documents)

		const snippets = await textSplitter.splitDocuments(documents)

		const docs = await Promise.all(
			snippets.map(async (doc, i) => ({
				...doc,
				metadata: {
					...doc.metadata,
					userId: weaviateConfig.userId,
					// Summarize first 50 files. Otherwise too slow.
					// summary: i < 50 ? await AISummary(doc.pageContent) : '',
					summary: '',
					ext: doc.metadata.source.split('.')[1] || ''
				}
			}))
		)

		const embeddings = new OpenAIEmbeddings({
			openAIApiKey: process.env.OPENAI_API_KEY
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