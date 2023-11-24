import {OpenAIEmbeddings} from 'langchain/embeddings/openai'
import {RecursiveCharacterTextSplitter} from 'langchain/text_splitter'
import {WeaviateStore} from 'langchain/vectorstores/weaviate'
import {cloneRepo} from './cloneRepo'
import {type WeaviateConfig} from './weaviate-client'

export default async function addRepo(
	weaviateConfig: WeaviateConfig,
	repoUrl: string,
	branch: string
) {
	const textSplitter = new RecursiveCharacterTextSplitter({
		chunkSize: 4000,
		chunkOverlap: 250
	})

	try {
		const repo = await cloneRepo(
			repoUrl,
			branch,
			textSplitter,
			process.env.GITHUB_ACCESS_TOKEN || ''
		)

		const docs = repo.map(doc => {
			return {
				...doc,
				metadata: {
					...doc.metadata,
					userId: weaviateConfig.userId,
					ext: doc.metadata.source.split('.')[1] || ''
				}
			}
		})

		const store = await WeaviateStore.fromExistingIndex(
			new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_API_KEY}),
			{
				// "as any" is required for langchain
				client: weaviateConfig.client as any,
				indexName: weaviateConfig.indexName
			}
		)

		// returns the Weaviate ids of the added documents
		return await store.addDocuments(docs)
	} catch (e) {
		console.error(e)
	}
}
