import axios from "axios"

export const deleteChat = async(chatId: number) => {
    const res = await axios.post('/api/delete-chat', {chatId})

    return res.data
}