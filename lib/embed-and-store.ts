// import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "langchain/document";
import * as dotenv from 'dotenv'
dotenv.config()

export async function embedDocs(client: Pinecone, docs: Document<Record<string, any>>[], videoLink:string) {
    const embeddings = new OpenAIEmbeddings({
        modelName: 'text-embedding-3-small'
    })
    const index = client.Index(process.env.PINECONE_INDEX!)

    //Storing the chunked texts into pinecone
    const vectorStore = await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex: index,
        namespace: videoLink
    })

    return vectorStore
}