"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { FileUpload } from "@/components/file-upload"
import { ChatMessage } from "@/components/chat-message"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Send, Bot } from "lucide-react"
import axios from "axios"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

interface UploadedFile {
  id: string
  name: string
  size: number
  uploadedAt: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFileUpload = async (files: File[]) => {
    setIsUploading(true)

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)

        const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        const newFile: UploadedFile = {
          id: response.data.file_id || Date.now().toString(),
          name: file.name,
          size: file.size,
          uploadedAt: new Date(),
        }

        setUploadedFiles((prev) => [...prev, newFile])
      }
    } catch (error) {
      console.error("Upload failed:", error)
      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: "Sorry, there was an error uploading your file. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsUploading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: input.trim(),
        file_ids: uploadedFiles.map((f) => f.id),
      })

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response.data.response || "I apologize, but I couldn't generate a response.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Chat request failed:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: "Sorry, I encountered an error while processing your question. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">RAG Chatbot</h1>
          <p className="text-gray-600 mt-2">Upload PDFs and ask questions about their content</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* File Upload Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FileUpload onFilesUploaded={handleFileUpload} isUploading={isUploading} />

                {uploadedFiles.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium text-sm text-gray-700 mb-2">
                        Uploaded Files ({uploadedFiles.length})
                      </h3>
                      <div className="space-y-2">
                        {uploadedFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="truncate font-medium">{file.name}</p>
                              <p className="text-gray-500 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              className="ml-2 h-6 w-6 p-0"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Chat
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Upload a PDF and start asking questions!</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                      ))}
                      {isLoading && (
                        <div className="flex items-center gap-2 text-gray-500">
                          <LoadingSpinner />
                          <span>Thinking...</span>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                <div className="border-t p-4">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask a question about your uploaded documents..."
                      disabled={isLoading || uploadedFiles.length === 0}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={!input.trim() || isLoading || uploadedFiles.length === 0}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                  {uploadedFiles.length === 0 && (
                    <p className="text-xs text-gray-500 mt-2">Upload at least one PDF to start chatting</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
