"use client";

import { File, UploadCloud, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Progress } from "./ui/progress";
import { useToast } from "@/components/ui/use-toast";

interface FileUploadProgress {
  progress: number;
  file: File;
  parsedText?: string;
  isProcessing: boolean;
}

const PdfColor = {
  bgColor: "bg-indigo-500",
  fillColor: "fill-indigo-500",
};

export default function FileUpload({
  onFileUpload,
  setParsedText,
}: {
  onFileUpload: (files: File[]) => void;
  setParsedText: (fileName: string, text: string) => void;
}) {
  const [filesToUpload, setFilesToUpload] = useState<FileUploadProgress[]>([]);
  const { toast } = useToast();

  const getFileIconAndColor = (file: File) => {
    if (file.type.includes("pdf")) {
      return {
        icon: <File size={40} className={PdfColor.fillColor} />,
        color: PdfColor.bgColor,
      };
    }

    return null;
  };

  const removeFile = (file: File) => {
    setFilesToUpload((prevUploadProgress) => {
      return prevUploadProgress.filter((item) => item.file !== file);
    });
  };

  const uploadFileToApi = async (file: File) => {
    const formData = new FormData();
    formData.append("FILE", file);

    try {
      const response = await fetch("/api/parse-data", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const parsedText = await response.text();
      
      // Update the file progress with parsed text
      setFilesToUpload((prev) => 
        prev.map((item) => 
          item.file === file 
            ? { ...item, parsedText, progress: 100, isProcessing: false }
            : item
        )
      );
      
      // Call the callback with the parsed text
      setParsedText(file.name, parsedText);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: (error as Error).message,
      });
      
      // Update the file progress to show error
      setFilesToUpload((prev) => 
        prev.map((item) => 
          item.file === file 
            ? { ...item, progress: 0, isProcessing: false }
            : item
        )
      );
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Add all files to the upload list
      const newFiles = acceptedFiles.map(file => ({
        file,
        progress: 0,
        isProcessing: true
      }));
      
      setFilesToUpload(prev => [...prev, ...newFiles]);
      
      // Call the callback with all files
      onFileUpload(acceptedFiles);
      
      // Process each file individually
      for (const file of acceptedFiles) {
        await uploadFileToApi(file);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: true, // Enable multiple file selection
  });

  return (
    <div>
      <div>
        <label
          {...getRootProps()}
          className="relative flex flex-col items-center justify-center w-full py-8 border-2 border-indigo-200 border-dashed rounded-xl cursor-pointer bg-gradient-to-br from-indigo-50 to-fuchsia-50 hover:from-indigo-100 hover:to-fuchsia-100 transition-colors"
        >
          <div className="text-center">
            <div className="border border-indigo-200 p-3 rounded-lg max-w-min mx-auto bg-white/70 shadow">
              <UploadCloud size={20} className="text-indigo-600" />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold text-indigo-700">Drag and drop PDF files</span>
            </p>
            <p className="text-xs text-indigo-500">
              Click to upload files (no size limit)
            </p>
          </div>
        </label>
        <Input
          {...getInputProps()}
          id="dropzone-file"
          accept="application/pdf"
          type="file"
          className="hidden"
          multiple
        />
      </div>

      {filesToUpload.length > 0 && (
        <div>
          <ScrollArea className="h-40">
            <p className="font-medium my-2 mt-6 text-indigo-700 text-sm">
              Files to upload
            </p>
            <div className="space-y-2 pr-3">
              {filesToUpload.map((fileUploadProgress) => {
                return (
                  <div
                    key={`${fileUploadProgress.file.name}-${fileUploadProgress.file.lastModified}`}
                    className="flex justify-between gap-2 rounded-xl overflow-hidden border border-indigo-100 group hover:pr-0 pr-2 bg-white/80 shadow"
                  >
                    <div className="flex items-center flex-1 p-2">
                      <div className="text-white">
                        {getFileIconAndColor(fileUploadProgress.file)?.icon}
                      </div>
                      <div className="w-full ml-2 space-y-1">
                        <div className="text-sm flex justify-between">
                          <p className="text-indigo-700 ">
                            {fileUploadProgress.file.name.slice(0, 25)}
                          </p>
                          <span className="text-xs">
                            {fileUploadProgress.isProcessing ? "Processing..." : `${fileUploadProgress.progress}%`}
                          </span>
                        </div>
                        <Progress
                          value={fileUploadProgress.progress}
                          className={
                            getFileIconAndColor(fileUploadProgress.file)?.color
                          }
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(fileUploadProgress.file)}
                      className="bg-gradient-to-r from-rose-500 to-red-500 text-white transition-all items-center justify-center cursor-pointer px-2 hidden group-hover:flex"
                    >
                      <X size={20} />
                    </button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
