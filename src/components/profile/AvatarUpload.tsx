import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AvatarUploadProps {
  avatarUrl: string | null;
  username: string | null;
  onFileSelect: (file: File) => void;
  uploading: boolean;
}

export const AvatarUpload = ({ avatarUrl, username, onFileSelect, uploading }: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative group">
      <Avatar className="h-24 w-24">
        <AvatarImage 
          src={avatarUrl || undefined} 
          alt="Profile picture" 
        />
        <AvatarFallback>
          <User className="h-12 w-12" />
        </AvatarFallback>
      </Avatar>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
        disabled={uploading}
      >
        <Upload className="h-6 w-6 text-white" />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onFileSelect(e.target.files[0]);
          }
        }}
        accept="image/*"
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
};