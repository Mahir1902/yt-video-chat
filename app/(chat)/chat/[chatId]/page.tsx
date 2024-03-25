

import { getChats } from "@/lib/get-chats";
import axios from "axios";
import { DrizzleChat, chats } from "@/lib/db/schema";
import { redirect } from "next/navigation";
import Image from "next/image";
import ChatBox from "@/components/ChatBox";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import NewChatBtn from "@/components/NewChatBtn";


type Props = {
  params: {
    chatId: string;
  };
};

export default async function page({ params: { chatId } }: Props) {
  //Fetch all the chats from the db

  async function getChats() {
    "use server";
    // const _chats = await db.select().from(chats)
    const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/fetch-chats`);
    return res.data;
  }

  const chats: DrizzleChat[] = await getChats();

  // Find a single chat according to the chatId
  const chat = chats.find((chat) => chat.id === parseInt(chatId));

  if (!chat) {
    redirect("/");
  }

  


  return (
    <div className="flex h-full w-full">
      <div className="bg-gray-900 hidden md:w-72 md:flex h-full md:fixed md:flex-col md:inset-y-0 text-white z-[80] overflow-y-auto ">
        <div className="flex flex-col space-y-4 h-full text-white">
          <div className="px-3 py-2  max-h-[6rem] text-center sticky">
            {/* <h1 className="text-2xl font-bold">Logo</h1> */}
            <NewChatBtn/>
          </div>
          <div className="space-y-1 flex flex-col">
            {chats.map((chat) => (
              
              <Link href={`/chat/${chat.id}`} key={chat.id} className={cn('truncate text-sm p-3 cursor-pointer hover:bg-white/10 rounded-lg mx-2 transition font-medium', chat.id === parseInt(chatId) && 'bg-white/10')}>
                
                {chat.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full w-full items-center justify-center pl-72">
        <div className="flex flex-col max-w-5xl w-full h-full">
          {/* heading */}
          <div className=" flex items-center justify-center px-5 mb-4 h-[5rem] gap-3 mt-4 ">
            <Image
              className="w-100 h-100 rounded-lg"
              src={chat.thumbnailUrl!}
              alt=""
              width={120}
              height={90}
            />
            <h2 className="font-semibold text-lg ">{chat?.title}</h2>
          </div>

          {/* chat box */}
          <ChatBox videoLink={chat.videoUrl} chatId = {chatId} />
        </div>
      </div>
    </div>
  );
}
