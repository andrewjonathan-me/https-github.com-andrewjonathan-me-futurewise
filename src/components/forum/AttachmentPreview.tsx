import React, { useState } from 'react';
import { FileText, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Attachment {
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  name?: string;
}

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemove?: () => void;
  isPreview?: boolean;
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ 
  attachment, 
  onRemove,
  isPreview = false 
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  const handleDocumentClick = () => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name || 'document';
    link.click();
  };

  const renderAttachment = () => {
    switch (attachment.type) {
      case 'image':
        return (
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg bg-gray-100 cursor-pointer group">
                <img 
                  src={attachment.url} 
                  alt="Attachment" 
                  className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
                />
              </div>
            </DialogTrigger>
            <DialogContent className={`${isMaximized ? 'max-w-[90vw] max-h-[90vh]' : 'max-w-2xl'}`}>
              <div className="relative overflow-auto">
                <img 
                  src={attachment.url} 
                  alt="Attachment" 
                  className="w-auto h-auto max-w-full max-h-[70vh] mx-auto"
                />
              </div>
            </DialogContent>
          </Dialog>
        );
      case 'video':
        return (
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg bg-gray-100 cursor-pointer group">
                <video 
                  src={attachment.url} 
                  controls 
                  className="h-full w-full object-contain"
                />
              </div>
            </DialogTrigger>
            <DialogContent className={`${isMaximized ? 'max-w-[90vw] max-h-[90vh]' : 'max-w-2xl'}`}>
              <video 
                src={attachment.url} 
                controls 
                className="w-auto h-auto max-w-full max-h-[70vh] mx-auto"
              />
            </DialogContent>
          </Dialog>
        );
      case 'audio':
        return (
          <div className="w-full max-w-sm rounded-lg bg-gray-50 p-4">
            <audio 
              src={attachment.url} 
              controls 
              className="w-full"
            />
          </div>
        );
      case 'document':
        return (
          <div 
            className="flex items-center gap-3 rounded-lg border bg-gray-50 p-4 max-w-sm cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={handleDocumentClick}
          >
            <FileText className="h-8 w-8 text-blue-500" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{attachment.name || 'Document'}</span>
              <span className="text-xs text-blue-500 hover:underline">Click to Download</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative my-4 animate-fade-in">
      {!isPreview && onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 z-10 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {renderAttachment()}
    </div>
  );
};

export default AttachmentPreview;