import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone"



export async function getVectorStore(client: Pinecone, videoLink:string) {

    // Ideally this would be passed as an agument or fetched from the database
    // const videoLink = "https://www.youtube.com/watch?v=IWZrIH50DnI&list=PL4HikwTaYE0EG379sViZZ6QsFMjJ5Lfwj&index=4"

    try {

        const embeddings = new OpenAIEmbeddings({
            modelName: 'text-embedding-3-small'
        })
        const index = client.Index(process.env.PINECONE_INDEX!)

        const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex: index,
            namespace: videoLink
        })

        return vectorStore
        
    } catch (error) {
        console.log(error);
        throw new Error('Something went wrong while getting the vector store')
    }
}