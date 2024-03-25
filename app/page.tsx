'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createChat } from "@/lib/create-chat";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { Loader2 } from 'lucide-react';

export default function Home() {


  const [videoLink, setVideoLink] = useState<string>("")

  const router = useRouter()

  const {mutate, isLoading} = useMutation({
    mutationFn: createChat
  })

  const handelSubmit =  async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Post request to create chat if res is good then redirect to chat page
    mutate(videoLink, {
      onSuccess: ({chatId}) => {
        toast.success('Chat created')
        // console.log(chatId)
        router.push(`/chat/${chatId}`)
      },
      onError: error => {
        toast.error('Error creating chat')
        console.log(error)
      }
    })
  }

  return (

      <div className="h-[100vh] border border-red-500 w-[100vw] flex flex-col justify-center items-center">
        <form className=" h-[20rem] w-[20rem] flex flex-col justify-center items-center gap-4"  onSubmit={handelSubmit}>
          <div className="w-full flex flex-col gap-3">
          <label htmlFor="" >Enter youtube video link</label>
          <Input type="text" className="w-full focus-visible:ring-transparent text-black" value={videoLink} onChange={(e) => {
            setVideoLink(e.target.value)
          }}/>
          </div>
          {/* <Button className="self-start" type="submit">Submit</Button> */}
          {isLoading ? <Loader2 className='h-5 w-5 text-black animate-spin mt-2'/> : <Button type='submit' className='mt-3'>Submit</Button>}
        </form>
      </div>
    
    );
}
