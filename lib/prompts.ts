import { ChatPromptTemplate } from "@langchain/core/prompts";



// export const qaPromptTemplate = `
// Answer the user's question according to the context provided to you. If you do not know the answer just say politely that you dont know. DO NOT try to make up answers.

// Context: {context}
// Question: {input}
// `

export const qaPromptTemplate = "Answer the user's question based on the context provided to you below. " +
"The context will be a part of a transcript from a youtube video\n" +
"Please do not make up answers if you do not know the answer and politely tell the user that you do not know the answer.\n\n " +
"Context: \n {context}"
