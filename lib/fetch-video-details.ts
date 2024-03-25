import axios from "axios"


const base_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=`


export const fetchVideoDetails = async (videoId: string) => {
    
    const apiKey = process.env.YOUTUBE_API
     
    const url = `${base_url + videoId}&key=${apiKey}`

    const {data} = await axios.get(url)

    const videoDetails = data.items[0].snippet

    return {
        title: videoDetails.title,
        description: videoDetails.description,
        thumbnail: videoDetails.thumbnails.default.url, // Url of video tumbnail
        channelTitle: videoDetails.channelTitle,
    }
}