import React from 'react';
import { Button } from "@/components/ui/button";

interface ReplyFormProps {
  content: string;
  onChange: (content: string) => void;
  onSubmit: () => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({
  content,
  onChange,
  onSubmit,
}) => {
  return (
    <div className="mt-2 flex gap-2">
      <input
        placeholder="Write a reply..."
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 rounded-md border p-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />
      <Button size="sm" onClick={onSubmit}>
        Reply
      </Button>
    </div>
  );
};

export default ReplyForm;