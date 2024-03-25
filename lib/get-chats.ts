import axios from "axios";

export const getChats = async () => {
    
    // const _chats = await db.select().from(chats)
    const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/fetch-chats`);
    return res.data;
}