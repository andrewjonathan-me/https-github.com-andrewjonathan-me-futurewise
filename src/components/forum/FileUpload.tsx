import React, { forwardRef } from 'react';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ImageIcon, Video, AudioWaveform, FileText } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  type: 'image' | 'video' | 'audio' | 'document';
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(({ onFileSelect, type }, ref) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File terlalu besar",
        description: "Ukuran file maksimal 2MB. Silakan gunakan link dari cloud storage (Google Drive, OneDrive, dll).",
        variant: "destructive"
      });
      if (event.target) {
        event.target.value = '';
      }
      return;
    }

    const validTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif'],
      video: ['video/mp4', 'video/webm'],
      audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
      document: [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]
    };

    if (!validTypes[type].includes(file.type)) {
      toast({
        title: "Format file tidak didukung",
        description: `Silakan pilih file ${type} yang valid`,
        variant: "destructive"
      });
      if (event.target) {
        event.target.value = '';
      }
      return;
    }

    onFileSelect(file);
  };

  const icons = {
    image: <ImageIcon className="w-4 h-4" />,
    video: <Video className="w-4 h-4" />,
    audio: <AudioWaveform className="w-4 h-4" />,
    document: <FileText className="w-4 h-4" />
  };

  const acceptTypes = {
    image: 'image/*',
    video: 'video/*',
    audio: 'audio/*',
    document: '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx'
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept={acceptTypes[type]}
        onChange={handleFileChange}
        className="hidden"
        id={`file-upload-${type}`}
        ref={ref}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => document.getElementById(`file-upload-${type}`)?.click()}
      >
        {icons[type]}
        <span className="ml-2">Upload {type}</span>
      </Button>
    </div>
  );
});

FileUpload.displayName = "FileUpload";

export default FileUpload;