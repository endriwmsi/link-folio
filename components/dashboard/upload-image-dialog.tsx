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

interface UploadImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: (url: string) => void;
}

export function UploadImageDialog({
  open,
  onOpenChange,
  onUploadComplete,
}: UploadImageDialogProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Profile Picture</DialogTitle>
          <DialogDescription>
            Choose an image to use as your profile picture. The image will be
            cropped to a square.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <UploadDropzone
            className="ut-button:bg-primary ut-button:ut-readying:bg-primary/90"
            endpoint="profileImage"
            onUploadBegin={() => setIsUploading(true)}
            onClientUploadComplete={(res) => {
              setIsUploading(false);
              if (res?.[0]) {
                onUploadComplete(res[0].ufsUrl);
                onOpenChange(false);
                toast.success("Profile picture updated");
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
