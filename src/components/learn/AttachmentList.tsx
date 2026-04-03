import { Download, Paperclip } from "lucide-react";

interface Attachment {
  title: string;
  fileUrl: string;
  fileType: string;
}

interface AttachmentListProps {
  attachments: Attachment[] | null | undefined;
}

export function AttachmentList({ attachments }: AttachmentListProps) {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Paperclip className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Tài liệu đính kèm</h3>
      </div>
      <ul className="space-y-2">
        {attachments.map((attachment, index) => (
          <li key={index}>
            <a
              href={attachment.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#155eef] hover:underline"
            >
              <Download className="h-4 w-4 shrink-0" />
              <span>{attachment.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
