"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Upload, FileText, AlertCircle } from "lucide-react"
import { LoadingSpinner } from "./loading-spinner"

interface FileUploadProps {
  onFilesUploaded: (files: File[]) => void
  isUploading: boolean
}

export function FileUpload({ onFilesUploaded, isUploading }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        console.warn("Some files were rejected:", rejectedFiles)
      }

      if (acceptedFiles.length > 0) {
        onFilesUploaded(acceptedFiles)
      }
    },
    [onFilesUploaded],
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive && !isDragReject ? "border-blue-500 bg-blue-50" : ""}
          ${isDragReject ? "border-red-500 bg-red-50" : ""}
          ${!isDragActive ? "border-gray-300 hover:border-gray-400" : ""}
          ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <>
              <LoadingSpinner />
              <p className="text-sm text-gray-600">Uploading...</p>
            </>
          ) : (
            <>
              {isDragReject ? (
                <>
                  <AlertCircle className="h-8 w-8 text-red-500" />
                  <p className="text-sm text-red-600">Only PDF files are allowed</p>
                </>
              ) : (
                <>
                  <FileText className="h-8 w-8 text-gray-400" />
                  {isDragActive ? (
                    <p className="text-sm text-blue-600">Drop the PDF files here...</p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600">Drag & drop PDF files here, or click to select</p>
                      <p className="text-xs text-gray-500">Max file size: 10MB</p>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => document.querySelector('input[type="file"]')?.click()}
        disabled={isUploading}
      >
        <Upload className="h-4 w-4 mr-2" />
        Choose Files
      </Button>
    </div>
  )
}
