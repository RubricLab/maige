import {WeaviateStore} from '@langchain/community/vectorstores/weaviate'
import {OpenAIEmbeddings} from '@langchain/openai'
import {RecursiveCharacterTextSplitter} from 'langchain/text_splitter'
import {GITHUB} from '~/constants'
import env from '~/env.mjs'
import {getInstallationId, getInstallationToken} from '../github'
import {cloneRepo} from './cloneRepo'
import {type WeaviateConfig} from './db'
import deleteRepo from './delete'
import {checkRepoExists} from './exists'
import {AISummary} from './summary'

export default async function addRepo(
	weaviateConfig: WeaviateConfig,
	repoFullName: string,
	branch: string,
	replace: boolean
) {
	const repoUrl = `${GITHUB.BASE_URL}/${repoFullName}`
	const textSplitter = new RecursiveCharacterTextSplitter({
		chunkSize: 4000,
		chunkOverlap: 250
	})

	try {
		const exists: boolean = await checkRepoExists(
			weaviateConfig.client,
			weaviateConfig.indexName,
			weaviateConfig.userId,
			repoUrl
		)
		if (exists && !replace)
			return `Repository ${repoUrl} already exists in index ${weaviateConfig.indexName}. Set replace to true to replace it.`
		else deleteRepo(weaviateConfig, repoUrl)
	} catch (e) {
		console.error(e)
		return
	}

	try {
		const cloneTimer = `Cloning repo ${repoUrl} @ ${branch}`
		console.time(cloneTimer)

		const installationId = await getInstallationId(repoFullName)
		const installationToken = await getInstallationToken(installationId)

		const repo = await cloneRepo(
			repoUrl,
			branch,
			textSplitter,
			installationToken || ''
		)

		console.timeEnd(cloneTimer)

		const summarizeTimer = `Summarizing ${repo.length} chunks`
		console.time(summarizeTimer)

		const docs = await Promise.all(
			repo.map(async (doc, i) => ({
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

		console.timeEnd(summarizeTimer)

		const embedTimer = `Embedding ${docs.length} chunks`
		console.time(embedTimer)

		const embeddings = new OpenAIEmbeddings({
			openAIApiKey: env.OPENAI_API_KEY,
			modelName: 'text-embedding-3-small'
		})

		const store = await WeaviateStore.fromExistingIndex(embeddings, {
			// "as any" is required for langchain
			client: weaviateConfig.client as any,
			indexName: weaviateConfig.indexName
		})

		// Returns the Weaviate IDs of the added documents
		const res = await store.addDocuments(docs)

		console.timeEnd(embedTimer)

		return res
	} catch (e) {
		console.error(e)
		return
	}
}
