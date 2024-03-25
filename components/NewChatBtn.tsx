'use client'

import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

export default function NewChatBtn() {

    const router = useRouter()

  return (
    <Button className='bg-blue-700 text-base font-semibold w-full hover:bg-opacity-70 hover:bg-blue-700' onClick={() => router.push('/')}>New Chat</Button>
  )
}
