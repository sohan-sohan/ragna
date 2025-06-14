"use client"

import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === "user"

  return (
    <div className={cn("flex gap-3 max-w-4xl", isUser ? "ml-auto flex-row-reverse" : "mr-auto")}>
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "bg-blue-500" : "bg-gray-500",
        )}
      >
        {isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
      </div>

      <div className={cn("flex flex-col gap-1 max-w-[80%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-lg px-4 py-2 text-sm",
            isUser ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900 border",
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        <span className="text-xs text-gray-500">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  )
}
