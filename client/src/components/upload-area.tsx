'use client';
import { useNoteStore } from '@/store/use-note-store';
import { UploadCloud, FileText } from 'lucide-react';
import { useCallback } from 'react';
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

export const UploadArea = () => {
  const { uploadNote, isUploading, uploadProgress } = useNoteStore();

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      await uploadNote(e.target.files[0]);
    }
  }, [uploadNote]);

  return (
    <Card className={`relative p-8 transition-colors border-dashed border-2 
      ${isUploading ? 'bg-gray-50 border-blue-200' : 'hover:border-blue-400 hover:bg-blue-50/30'}`}>
      
      {isUploading ? (
        <div className="flex flex-col items-center gap-4 py-2 max-w-md mx-auto">
          <div className="flex items-center gap-3 w-full">
            <div className="p-2 bg-white rounded-md shadow-sm">
               <FileText className="w-6 h-6 text-blue-500 animate-pulse" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-xs font-medium text-gray-600">
                <span>Analyzing Document...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </div>
          <p className="text-xs text-center text-gray-400">
            Extracting text • Generating embeddings • Auto-tagging
          </p>
        </div>
      ) : (
        <>
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept=".pdf,.txt"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center gap-3 text-center pointer-events-none">
            <div className="p-4 bg-blue-100/50 rounded-full text-blue-600">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">
                Click to upload or drag & drop
              </p>
              <p className="text-sm text-gray-500 mt-1">
                PDF or TXT files (Local Processing)
              </p>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};