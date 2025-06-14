
import React, { useRef, useState } from "react";
import { FileUp, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type DocUploaderProps = {
  document: File | null;
  setDocument: (file: File | null) => void;
};

const ACCEPTED_TYPES = [
  ".pdf",
  ".docx",
  ".txt",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export default function DocumentUploader({ document, setDocument }: DocUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    setDocument(file);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg h-64 flex flex-col items-center justify-center px-6 py-4 transition-colors duration-200 ${
        dragOver ? "border-primary bg-secondary/60" : "border-muted"
      }`}
      onDrop={e => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files);
      }}
      onDragOver={e => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      tabIndex={0}
      aria-label="Document upload area"
    >
      {document ? (
        <div className="flex flex-col items-center gap-3">
          <FileUp size={36} className="text-primary" />
          <div className="text-sm font-medium">{document.name}</div>
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDocument(null)}
              aria-label="Remove document"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          className="flex flex-col items-center focus:outline-none"
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          <FileUp size={38} className="mb-2 text-muted-foreground" />
          <span className="font-semibold text-lg">Upload a document</span>
          <span className="text-sm text-muted-foreground mb-1">
            Drag & drop, or click to select
          </span>
          <span className="text-xs text-muted-foreground">(.pdf, .docx, .txt)</span>
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={e => handleFile(e.target.files)}
        data-testid="file-input"
      />
    </div>
  );
}
