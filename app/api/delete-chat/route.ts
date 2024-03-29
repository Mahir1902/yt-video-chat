import { db } from "@/lib/db"
import { chats, messages } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"




export const POST = async (req: Request, res: Response) => {

    const { chatId } = await req.json()

    try {

        await db.delete(messages).where(eq(messages.chatId, chatId));


        const deletedChat = await db.delete(chats).where(eq(chats.id, chatId))

        console.log(deletedChat)

        return NextResponse.json({message: `Chat deleted`}, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json(error)
    }

}