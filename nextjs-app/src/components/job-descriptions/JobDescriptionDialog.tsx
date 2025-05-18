import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobDescriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  jobDescription: {
    id: string;
    description: string;
    createdAt: string;
    role?: string;
    pdfUrl?: string;
  } | null;
  onViewResume: (jobId: string, pdfUrl?: string) => void;
}

export default function JobDescriptionDialog({
  isOpen,
  onClose,
  jobDescription,
  onViewResume,
}: JobDescriptionDialogProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    if (jobDescription) {
      navigator.clipboard.writeText(jobDescription.description);
      toast({
        title: "Copied!",
        description: "Job description copied to clipboard",
      });
    }
  };

  if (!jobDescription) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            {jobDescription.role || 'Job Description'}
          </DialogTitle>
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button> */}
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
            <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
              {jobDescription.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Added on {new Date(jobDescription.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                <span>Copy JD</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => onViewResume(jobDescription.id, jobDescription.pdfUrl)}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                <span>View Resume</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 