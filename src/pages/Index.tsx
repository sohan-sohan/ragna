
import React, { useState } from "react";
import DocumentUploader from "@/components/DocumentUploader";
import ChatBotPanel from "@/components/ChatBotPanel";

const Index = () => {
  const [document, setDocument] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="w-full py-7 border-b mb-0 shadow-sm flex items-center px-10">
        <h1 className="text-2xl font-semibold tracking-tight flex-1">
          RAG + LLM Playground
        </h1>
        {/* Space for future: user avatar, settings, etc. */}
      </header>
      <main className="flex-1 flex flex-row items-stretch gap-0 px-0"
        style={{ minHeight: "calc(100vh - 74px)" }}>
        {/* Left: Document uploader */}
        <div className="flex flex-col w-full max-w-sm border-r px-6 py-10 bg-card justify-start">
          <div>
            <h2 className="text-lg font-bold mb-4">Document Panel</h2>
            <DocumentUploader document={document} setDocument={setDocument} />
            <div className="text-xs text-muted-foreground mt-4">
              {document
                ? "You can now ask questions about your uploaded document."
                : "Supported formats: PDF, DOCX, TXT. Only one document at a time."}
            </div>
          </div>
        </div>
        {/* Right: Chatbot */}
        <div className="flex-1 flex flex-col px-0 py-10 min-w-0">
          <h2 className="text-lg font-bold mb-4 px-6">Chatbot</h2>
          <div className="flex-1 flex px-6">
            <ChatBotPanel document={document} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
