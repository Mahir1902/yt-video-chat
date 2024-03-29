import { textSplitter } from "@/lib/text-splitter";
import { NextResponse } from "next/server"
import { YoutubeTranscript } from "youtube-transcript";

import fs from 'fs'
import path from 'path'
import { embedDocs } from "@/lib/embed-and-store";
import { getPineconeClient } from "@/lib/pinecone-client";
import { extractVideoID } from "@/lib/extract-videoId";
import { fetchVideoDetails } from "@/lib/fetch-video-details";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import {StatusCodes} from 'http-status-codes'

export async function POST(req:Request, res:Response) {
    const {videoLink} = await req.json()

    // Extract the video id from the link
    const videoId = extractVideoID(videoLink)
    if(!videoId) {
        throw new Error('No video id')
      }

    const videoDetails = await fetchVideoDetails(videoId)

    // Get the transcript of the video from the youtube link
    // const transcript = await YoutubeTranscript.fetchTranscript(videoLink);
    
    // // console.log(transcript)

    // // Transcript is in chunks, so we join them to get the whole text
    // const wholeText = transcript.map((textObj) => textObj.text).join(" ");


    // // Define the path for the new file to save whole text into
    // const filePath = path.join(process.cwd(), 'texts', 'transcript.txt');

    // // Write the wholeText to a file in the texts directory
    // fs.writeFileSync(filePath, wholeText, 'utf8')

    // Split the text into chunks 
    const docs = await textSplitter(videoLink)
    // console.log(docs)
    console.log('Splitting successfull')

    //TODO:Delete the text file if we don't need it anymore

    // Embed and store the chunks into pinecone
    // Get the pinecone client
    const pinconeClient = await getPineconeClient()
    const vectorStore = await embedDocs(pinconeClient,docs, videoLink)

    // Create a new chat in the database
    const chatId = await db.insert(chats).values({
        title: videoDetails.title,
        description: videoDetails.description,
        videoUrl: videoLink,
        channelTitle: videoDetails.channelTitle,
        thumbnailUrl: videoDetails.thumbnail
    }).returning({
        chatId: chats.id
    })


    // console.log(docs)
    return NextResponse.json({chatId: chatId[0].chatId}, {status: StatusCodes.CREATED})
}