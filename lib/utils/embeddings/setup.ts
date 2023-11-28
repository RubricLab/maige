import {OpenAIEmbeddings} from 'langchain/embeddings/openai'
import {RecursiveCharacterTextSplitter} from 'langchain/text_splitter'
import {WeaviateStore} from 'langchain/vectorstores/weaviate'
import weaviate from 'weaviate-ts-client'
import {GITHUB} from '~/constants'
import {cloneRepo} from './cloneRepo'

const repoUrl = `${GITHUB.BASE_URL}/RubricLab/maige`
const repoBranch = 'main'

const textSplitter = new RecursiveCharacterTextSplitter({
	chunkSize: 4000,
	chunkOverlap: 250
})

export async function main() {
	console.log('Cloning repo...')

	const repo = await cloneRepo(repoUrl, repoBranch, textSplitter)

	const docs = repo.map(doc => {
		return {
			...doc,
			metadata: {
				...doc.metadata,
				userId: '0',
				ext: doc.metadata.source.split('.')[1] || ''
			}
		}
	})

	console.log('Creating Weaviate schema...')

	const client = weaviate.client({
		scheme: 'https',
		host: process.env.WEAVIATE_HOST
	})

	await WeaviateStore.fromDocuments(docs, new OpenAIEmbeddings(), {
		client,
		indexName: 'CodeSearch',
		textKey: 'text'
	})
}

main()
