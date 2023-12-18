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
	branch: string,
	filePaths: string[]
) {
	const textSplitter = new RecursiveCharacterTextSplitter({
		chunkSize: 4000,
		chunkOverlap: 250
	})

	try {
		await deleteFiles(weaviateConfig, repoUrl, filePaths, branch)

		const files = await getFiles(filePaths, repoUrl, branch)

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

		const snippets = await textSplitter.splitDocuments(documents)

		const docs = await Promise.all(
			snippets.map(async (doc, i) => ({
				...doc,
				metadata: {
					...doc.metadata,
					userId: weaviateConfig.userId,
					// Summarize first 50 files. Otherwise too slow.
					summary: i < 50 ? await AISummary(doc.pageContent) : '',
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