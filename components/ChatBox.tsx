'use client'

import { useChat } from 'ai/react';
import React, { useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage';
import { BsRobot } from 'react-icons/bs';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { IoSend } from 'react-icons/io5';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { BiLoaderAlt } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";
import { deleteChat } from '@/lib/delete-chat';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type Props = {
  videoLink:string,
  chatId: string
}

export default function ChatBox({videoLink, chatId}: Props) {

  //Fecth the messages from the db
  const {data, isLoading:loading} = useQuery({
    queryFn: async () => {
      const res = await axios.post('/api/get-messages', {chatId})
      return res.data
    }
  })


  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
    setInput
  } = useChat({
    initialMessages: 
      data || []
    ,
    body: {
      videoLink,chatId
    }
  }); // sends the current messages and input to this endpoint /api/chat

  /**
   * Check if the last message was sent by the user
   * This is so we can add the loading state when the streaming has not started yet
   */
  const isLastMessageUser = messages[messages.length - 1]?.role === "user";


  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the chat when a new message is added
  useEffect(() => {
    if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages])

  // useEffect(() => {
  //   if(messages.length > 0) {
  //     const latestMessage = messages[messages.length - 1]
  //     console.log('saving message')
  //     async function saveMessage() {

  //       const res = await axios.post('http://localhost:3000/api/save-message', {latestMessage, chatId})
  //       return res
  //     }

  //     saveMessage().then(res => {console.log(res)})
  //     console.log(messages)
  //   }
  // }, [messages])


  // ===================== Delete Chat =====================

    const queryClient = useQueryClient()

    const router = useRouter()

    const deleteMutation = useMutation(deleteChat, {
      onSuccess: (data) => {
          toast.success(data.message)
          queryClient.invalidateQueries('chats')
          router.push('/')
      },
      onError: (error) => {
          toast.error('Error deleting chat')
          console.log(error)
      }
    })

    const handleDelete = async() => {
      const chatIdNumber = +chatId
      deleteMutation.mutate(chatIdNumber)
    }

  

  return (
    <div className="h-[95vh] flex flex-col gap-4 ">
          <div className="bg-gray-300 mx-4 my-2 rounded-lg overflow-y-auto px-3 py-3 flex-grow  scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-black/40 " ref={scrollRef}>
            {messages.map((message) => (
              <ChatMessage message={message} key={message.id} />
            ))}
            {isLoading && isLastMessageUser && (
              <ChatMessage
                message={
                  {
                    id: 'loading',
                    role: 'assistant',
                    content: 'Thinking...'
                  }
                }
              />
            )}
            {error && (
              <ChatMessage message={{
                id: 'error',
                role: 'assistant',
                content: 'An error occured, please try again'
              }}/>
            )}
            {!error && messages.length === 0 && !loading && (
              <div className="flex flex-col h-full items-center justify-center gap-3 text-center mx-8">
                <BsRobot size={29}/>
                <p className="text-lg font-medium">Send a message to start the chat!</p>
                <p>You can ask any qustion about video and I will find the relavent information.</p>
              </div>
            )}
            {loading && (
              <div className=' font-medium flex justify-center items-center h-full'>
                <BiLoaderAlt className='w-5 h-5 animate-spin'/>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="mx-2 mb-4 flex gap-2 items-center ">
            <div className='flex w-full gap-3'>

            <Input className="focus-visible:ring-transparent" type="text" value={input} placeholder="Ask me something..." onChange={handleInputChange}/>
            <Button type="submit" className="flex-none flex items-center justify-center disabled:opacity-50 transition" disabled={isLoading || input.length === 0} title="Submit Message">
              <IoSend />
            </Button>
            <Button className='' variant={'destructive'} onClick={handleDelete}><FaRegTrashAlt className='w-4 h-4'/></Button>
            </div>
          </form>
        </div>
  )
}