import { Button } from "@/components/ui/button";

interface TestCompletionProps {
  onSave: () => void;
}

export const TestCompletion = ({ onSave }: TestCompletionProps) => {
  return (
    <div className="text-center space-y-6">
      <p className="text-lg text-gray-700 dark:text-white">
        Anda telah menyelesaikan tes. Klik tombol di bawah untuk menyimpan hasil tes Anda.
      </p>
      <Button
        onClick={onSave}
        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-lg"
      >
        Simpan Hasil Tes
      </Button>
    </div>
  );
};