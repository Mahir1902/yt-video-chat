import React from "react";
import { Message } from "ai/react";
import { cn } from "@/lib/utils";
import { BsRobot } from "react-icons/bs";

type Props = {
  message: Message;
};

export default function ChatMessage({ message: { role, content } }: Props) {
  const isAIMessage = role === "assistant";

  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAIMessage ? "ml-5 justify-start" : "mr-5 justify-end"
      )}
    >
      {isAIMessage && <BsRobot className="mr-2 size-[1.75rem]  " />}
      <div className={cn('border px-3 py-2 rounded-md border-black max-w-[35rem]', isAIMessage ? 'bg-gray-300' : 'bg-black text-white ')}>
        {content}
      </div>
    </div>
  );
}
