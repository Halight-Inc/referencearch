import { useState, useRef } from "react";
import { Upload, FileText, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFilesSelected: (files: FileList | null) => void;
}

export default function FileUpload({ onFilesSelected }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  // Handle file input change
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilesSelected(e.target.files);
    
    // Reset the input value so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Open file dialog when button is clicked
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
        isDragging
          ? "border-blue-600 bg-blue-50"
          : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
      }`}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="mb-4 relative">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <FileUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Upload Supporting Materials</h3>
        <p className="text-sm text-slate-600 mb-4 max-w-sm mx-auto">
          Drag and drop your files here, or click the button below to browse your computer
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-2 mb-2">
          <div className="bg-blue-50 text-blue-800 text-xs font-medium py-1 px-2 rounded flex items-center">
            <FileText className="h-3 w-3 mr-1" />
            .txt files
          </div>
          <div className="bg-blue-50 text-blue-800 text-xs font-medium py-1 px-2 rounded flex items-center">
            <FileText className="h-3 w-3 mr-1" />
            .md files
          </div>
        </div>
        
        <div className="text-xs text-slate-500 mb-4">
          Maximum 2 files
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".txt,.md"
          multiple
          onChange={handleFileSelect}
        />
        <Button
          type="button"
          size="sm"
          onClick={handleButtonClick}
          className="flex items-center gap-1"
        >
          <Upload className="h-4 w-4" />
          Browse Files
        </Button>
      </div>
    </div>
  );
}
