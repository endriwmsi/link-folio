"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UploadDropzone } from "@/utils/uploadthing";

interface UploadBackgroundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: (url: string) => void;
}

export function UploadBackgroundDialog({
  open,
  onOpenChange,
  onUploadComplete,
}: UploadBackgroundDialogProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Background Image</DialogTitle>
          <DialogDescription>
            Choose an image to use as your profile background. For best results,
            use an image at least 1920x1080 pixels.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <UploadDropzone
            endpoint="backgroundImage"
            onUploadBegin={() => setIsUploading(true)}
            onClientUploadComplete={(res) => {
              setIsUploading(false);
              if (res?.[0]) {
                onUploadComplete(res[0].url);
                onOpenChange(false);
                toast.success("Background image updated");
              }
            }}
            onUploadError={(error) => {
              setIsUploading(false);
              toast.error(error.message || "Failed to upload image");
            }}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
