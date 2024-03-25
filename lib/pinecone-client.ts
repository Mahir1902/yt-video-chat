import {Pinecone} from '@pinecone-database/pinecone'



let pineconeClientInstance: Pinecone | null = null


// Initialize the pinecone client
async function initPineconeClient() {
    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
        // environment: process.env.PINECONE_ENV as string
    })

    return pinecone
}

// Returns the pinecone client instance if it exists, otherwise initializes it and returns it
export async function getPineconeClient() {
    if(!pineconeClientInstance) {
        pineconeClientInstance = await initPineconeClient()
    }

    return pineconeClientInstance
}