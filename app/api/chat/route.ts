import {OpenAI} from '@langchain/openai'
import { ChatCompletionMessageParam } from 'ai/prompts'
import { LangChainStream, Message, OpenAIStream, StreamingTextResponse } from 'ai'
import { NextResponse } from 'next/server'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { ChatPromptTemplate, MessagesPlaceholder } from 'langchain/prompts'
import { qaPromptTemplate } from '@/lib/prompts'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { getPineconeClient } from '@/lib/pinecone-client'
import { getVectorStore } from '@/lib/get-vector-store'
import { createRetrievalChain } from 'langchain/chains/retrieval'
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever'
import { AIMessage, HumanMessage } from 'langchain/schema';
import { db } from '@/lib/db'
import { messages as _messages} from '@/lib/db/schema'
/**
 * messages from useChat hook can be found in the request body
 */
export async function POST(req:Request, res: Response) {
    try {
        const {messages, videoLink, chatId} = await req.json()
        
        // console.log(videoLink)
    
        // console.log(messages)

        // The last message in the array is the user's message
        const userMessage = messages[messages.length - 1].content

        //Handel straming from langchain using ai sdk
        const {stream, handlers} = LangChainStream({
            onStart: async() => {
                await db.insert(_messages).values({
                    chatId,
                    content: userMessage,
                    role: 'user'
                })
                
            },
            onCompletion: async(completion) => {
                await db.insert(_messages).values({
                    chatId,
                    content: completion,
                    role: 'assistant'
                })
                
            }
        })
    
        // Create a new instance of the chat model
        const chatModel = new ChatOpenAI({
            modelName: 'gpt-3.5-turbo',
            streaming: true,
            callbacks: [handlers],
            verbose: true
        })


        // Prompt needed as the system message
        const prompt = ChatPromptTemplate.fromMessages([
            [
                'system',
                qaPromptTemplate
            ],
            new MessagesPlaceholder('chat_history'), //MessagesPlaceholder is a class that accepts the chat history array and converts into strings
            [
                'user',
                '{input}'
            ]
        ])

        // createStuffDocumentsChain is a function that creates a chain that allows us to pass an array of documents as context
        const combineDocsChain = await createStuffDocumentsChain({
            llm: chatModel,
            prompt
        })

        const pineconeClient = await getPineconeClient()
        const retriever = (await getVectorStore(pineconeClient, videoLink)).asRetriever({
            k: 8
        })

        // const retriverPrompt = ChatPromptTemplate.fromMessages([
        //     new MessagesPlaceholder('chat_history'),
        //     ['user', '{input}'],
        //     ['user', "Given the above converstaion, generate a search query to look up in order to get infromation relevant to the converstaion."]
        // ])

        /**
         * This retirever takes in the user input as well as the chat history
         * Converts all of this into a simple query and searches the vector store for the most similar documents
         */
        // const historyAwareRetriever = await createHistoryAwareRetriever({
        //     llm:chatModel,
        //     retriever,
        //     // This prompt is to format the query
        //     rephrasePrompt: retriverPrompt
        // })
        
        //Create a chain 
        // const chain = propmt.pipe(chatModel)
        const retrievalChain = await createRetrievalChain({
            combineDocsChain,
            retriever,
        })

        const chatHistory = (messages as Message[]).map((message) => {
           return message.role == 'user' ? new HumanMessage(message.content) : new AIMessage(message.content)
        })

        // console.log(chatHistory)

         retrievalChain.invoke({
            input: userMessage,
            chat_history: chatHistory
        })

        // console.log('This is the stream,', stream)

        
    
        return new StreamingTextResponse(stream)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: 'Internal server error'}, {status: 500})
    }
}   