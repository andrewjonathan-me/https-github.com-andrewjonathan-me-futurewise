interface ImagePreviewProps {
  url: string;
}

export function ImagePreview({ url }: ImagePreviewProps) {
  return (
    <div className="relative w-full max-w-md">
      <img
        src={url}
        alt="Preview"
        className="w-full rounded-lg border dark:border-gray-700"
      />
    </div>
  );
}