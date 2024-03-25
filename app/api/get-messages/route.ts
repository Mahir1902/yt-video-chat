import { db } from "@/lib/db"
import {messages} from '@/lib/db/schema'
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"


export const POST = async (req: Request, res: Response) => {
    const {chatId}  = await req.json()

    console.log(typeof(chatId))
    
    const retrievedMessages = await db.select().from(messages).where(eq(messages.chatId, chatId))

    // console.log(retrievedMessages)

    return NextResponse.json(retrievedMessages)
}