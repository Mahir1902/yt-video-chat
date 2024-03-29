import { YoutubeLoader } from "langchain/document_loaders/web/youtube";
import { NextResponse } from "next/server";
import { TranscriptResponse, YoutubeTranscript } from "youtube-transcript";
import { Innertube } from "youtubei.js";
import { Document } from "@langchain/core/documents";

export const POST = async (req: Request, res: Response) => {
  try {
    const { videoUrl } = await req.json();

    // console.log(videoUrl);

    const loader = YoutubeLoader.createFromUrl(videoUrl, {
      language: "en",
        
    });

    const docs = await loader.load();

    return NextResponse.json(docs);

    // const match = videoUrl.match(
    //     /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/
    //   );
    //   if (match !== null && match[1].length === 11) {
    //     const youtube = await Innertube.create();

    //     console.log(youtube)

    //     const videoInfo = await youtube.getBasicInfo(match[1]);
    //     console.log("Video Info:", videoInfo.basic_info);
    //   }

      


  } catch (error) {
    console.error(error);
    return NextResponse.json(error);
  }
};
