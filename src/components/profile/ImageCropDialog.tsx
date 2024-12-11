import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewUrl: string | null;
  crop: Crop;
  onCropChange: (crop: Crop) => void;
  onSave: () => void;
  uploading: boolean;
  imageRef: React.RefObject<HTMLImageElement>;
}

export const ImageCropDialog = ({
  open,
  onOpenChange,
  previewUrl,
  crop,
  onCropChange,
  onSave,
  uploading,
  imageRef,
}: ImageCropDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Crop Profile Picture</DialogTitle>
        </DialogHeader>
        {previewUrl && (
          <div className="flex flex-col gap-4">
            <ReactCrop
              crop={crop}
              onChange={onCropChange}
              aspect={1}
              circularCrop
            >
              <img
                ref={imageRef}
                src={previewUrl}
                alt="Crop preview"
                style={{ maxWidth: '100%' }}
              />
            </ReactCrop>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={onSave}
                disabled={uploading}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};