"use client";
import React, { useState } from "react";
import { useToast } from "./ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FileUpload from "./FileUploader";

interface ParsedPdfData {
  fileName: string;
  parsedText: string;
  uploadTime: Date;
}

function HomePage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const [parsedPdfs, setParsedPdfs] = useState<ParsedPdfData[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (files: File[]) => {
    setUploadedFiles(files);
    setOpen(false);
    
    toast({
      variant: "default",
      title: "Files Uploaded",
      description: `${files.length} PDF file(s) have been uploaded successfully.`,
    });
    
    setLoading(true);
  };

  const handleParsedText = (fileName: string, text: string) => {
    setParsedPdfs(prev => {
      // Remove existing entry for this file if it exists
      const filtered = prev.filter(pdf => pdf.fileName !== fileName);
      // Add new entry
      return [...filtered, {
        fileName,
        parsedText: text,
        uploadTime: new Date()
      }];
    });
    
    setLoading(false);
  };

  const removePdf = (fileName: string) => {
    setParsedPdfs(prev => prev.filter(pdf => pdf.fileName !== fileName));
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 p-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white text-lg font-bold py-2 px-6 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-300">
            Upload Files
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] p-6 bg-white/90 backdrop-blur rounded-xl shadow-xl border border-indigo-100">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
              Upload your PDF files
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FileUpload
              onFileUpload={handleFileUpload}
              setParsedText={handleParsedText}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {loading && (
        <div className="mt-6 flex items-center justify-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
        </div>
      )}
      
      {parsedPdfs.length > 0 && (
        <div className="mt-6 w-full max-w-4xl space-y-6">
          {parsedPdfs.map((pdfData, index) => (
            <div key={pdfData.fileName} className="bg-white/90 backdrop-blur p-6 rounded-xl shadow border border-indigo-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
                  {pdfData.fileName}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    {pdfData.uploadTime.toLocaleTimeString()}
                  </span>
                  <button
                    onClick={() => removePdf(pdfData.fileName)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg whitespace-pre-wrap max-h-96 overflow-y-auto">
                {pdfData.parsedText}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;

