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

function HomePage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const [parsedText, setParsedText] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(() => {
      return file;
    });

    setOpen(() => {
      return false;
    });
    toast({
      variant: "default",
      title: "File Uploaded",
      description: `${file.name} has been uploaded successfully.`,
    });
    setLoading(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 p-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white text-lg font-bold py-2 px-6 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-300">
            Upload File
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] p-6 bg-white/90 backdrop-blur rounded-xl shadow-xl border border-indigo-100">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
              Upload your file
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FileUpload
              onFileUpload={handleFileUpload}
              setParsedText={(text: string) => {
                setParsedText(text);
                setLoading(false);
              }}
              maxSize={8 * 1024 * 1024} // 8 MB
            />
          </div>
        </DialogContent>
      </Dialog>
      {loading && (
        <div className="mt-6 flex items-center justify-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
        </div>
      )}
      {parsedText && (
        <div className="mt-6 w-full max-w-3xl bg-white/90 backdrop-blur p-4 rounded-xl shadow border border-indigo-100">
          <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">Parsed Text</h3>
          <p className="bg-indigo-50 p-4 rounded whitespace-pre-wrap">
            {parsedText}
          </p>
        </div>
      )}
    </div>
  );
}

export default HomePage;

