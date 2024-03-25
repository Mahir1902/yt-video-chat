import {RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { TextLoader } from "langchain/document_loaders/fs/text";
import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured';
import path from 'path'
import * as dotenv from 'dotenv'
dotenv.config()

export async function textSplitter() {


    const options = {
        apiKey: process.env.UNSTRUCTURED_API_KEY,
        apiUrl: process.env.UNSTRUCTURED_API_URL
    }

    const textPath = path.join(process.cwd(), 'texts', 'transcript.txt')
    
    // This is to convert the texts into a document to be used with models 
    // const loader = new TextLoader(textPath)
    const loader = new UnstructuredLoader(
        textPath,
        options,
        // strategy: "hi_res"
    )
    const docs = await loader.load()

    console.log(docs)

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 150,
    })
    
    const splitDocs = await splitter.splitDocuments(docs) // Array of split docs
    
    return splitDocs
}