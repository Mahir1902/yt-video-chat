import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { NextResponse } from "next/server";


export async function POST(req: Request, res: Response) {

    try {

        const chatData = await db.select().from(chats)

        return NextResponse.json(chatData)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json(error)
    }
    
}