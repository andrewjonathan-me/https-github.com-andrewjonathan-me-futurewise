import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { processWithAPI, processWithTesseract, parseGrades } from "./OCRProcessing";
import { ImagePreview } from "./ImagePreview";

interface OCRInputProps {
  onResultsDetected: (grades: Record<string, number>) => void;
}

export function OCRInput({ onResultsDetected }: OCRInputProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File terlalu besar",
        description: "File terlalu besar. Silakan masukkan nilai secara manual.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsProcessing(true);
    setProgress(0);

    try {
      toast({
        title: "Upload berhasil",
        description: "Sedang memproses...",
      });

      let text: string;
      try {
        // Try API first
        text = await processWithAPI(file);
        console.log('API OCR Result:', text);
      } catch (error) {
        // Fallback to Tesseract
        console.log('Falling back to Tesseract OCR');
        toast({
          title: "Menggunakan metode alternatif",
          description: "Proses mungkin memakan waktu lebih lama...",
        });
        text = await processWithTesseract(file);
        console.log('Tesseract OCR Result:', text);
      }

      const grades = parseGrades(text);
      
      toast({
        title: "Proses OCR selesai",
        description: "Silakan periksa data Anda.",
      });

      onResultsDetected(grades);
    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: "Gagal memproses gambar",
        description: "Terjadi kesalahan saat memproses gambar. Silakan coba lagi atau masukkan nilai secara manual.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          id="ocr-input"
          disabled={isProcessing}
        />
        <Button
          onClick={() => document.getElementById('ocr-input')?.click()}
          disabled={isProcessing}
          variant="outline"
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            'Upload Foto Rapor'
          )}
        </Button>

        {previewUrl && <ImagePreview url={previewUrl} />}

        {isProcessing && (
          <div className="w-full space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center dark:text-gray-400">
              Memproses gambar... {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>

      <Alert>
        <AlertDescription>
          Upload foto rapor Anda untuk mengisi nilai secara otomatis. 
          Pastikan foto jelas dan nilai terlihat dengan baik. 
          Anda dapat mengedit hasil secara manual setelah proses selesai.
        </AlertDescription>
      </Alert>
    </div>
  );
}