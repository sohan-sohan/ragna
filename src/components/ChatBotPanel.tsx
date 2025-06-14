
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Message = {
  text: string;
  sender: "user" | "bot";
  id: string;
  ts: number;
};

type ChatBotPanelProps = {
  document: File | null;
};

function mockBotReply(userInput: string, doc: File | null): Promise<string> {
  // Demo: Just echo and simulate a context reference
  return new Promise(resolve =>
    setTimeout(() => {
      resolve(doc
        ? `I have read "${doc.name}". You asked: "${userInput}"`
        : `No document uploaded. You asked: "${userInput}"`
      );
    }, 700)
  );
}

export default function ChatBotPanel({ document }: ChatBotPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (userInput.trim() === "") return;
    const msg: Message = {
      text: userInput,
      sender: "user",
      id: crypto.randomUUID(),
      ts: Date.now(),
    };
    setMessages(msgs => [...msgs, msg]);
    setUserInput("");
    const reply = await mockBotReply(userInput, document);
    setMessages(msgs => [
      ...msgs,
      {
        text: reply,
        sender: "bot",
        id: crypto.randomUUID(),
        ts: Date.now(),
      },
    ]);
  };

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <section className="flex flex-col h-full w-full max-h-[550px] border rounded-lg bg-card shadow-md">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-muted-foreground text-center pt-10">
            {document
              ? `Ask me anything about "${document.name}".`
              : "Please upload a document to get started."}
          </div>
        )}
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-xl px-4 py-2 shadow-sm max-w-[70%] transition-all ${
                msg.sender === "user"
                  ? "bg-primary text-white"
                  : "bg-accent text-foreground"
              }`}
            >
              <span>{msg.text}</span>
              <div className="text-xs text-gray-400 mt-1 flex justify-end">
                {new Date(msg.ts).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form
        className="flex items-center gap-2 border-t px-4 py-3 bg-muted/40"
        onSubmit={e => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          type="text"
          placeholder={document ? `Ask about "${document.name}"...` : "Upload document to ask"}
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          disabled={!document}
          className="flex-1 bg-transparent outline-none p-2 text-base"
          aria-label="Chat message"
          autoFocus
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // prevent newline
              sendMessage();
            }
          }}
        />
        <Button type="submit" disabled={!document || !userInput.trim()}>
          Send
        </Button>
      </form>
    </section>
  );
}
