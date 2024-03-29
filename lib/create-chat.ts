import axios from "axios"


export const createChat = async (videoLink:string) => {0
    const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/create-chat`, {videoLink})
    // console.log(res.data)
    return res.data
}  