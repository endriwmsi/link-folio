"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Grip, Pencil, Trash2 } from "lucide-react";
import { EditLinkDialog } from "./edit-link-dialog";
import { DeleteLinkDialog } from "./delete-link-dialog";

type LinkProps = {
  link: {
    id: string;
    title: string;
    url: string;
    enabled: boolean;
    clicks: number;
  };
  onToggleEnabled: (id: string, enabled: boolean) => void;
  onEdit: (id: string, title: string, url: string) => void;
  onDelete: (id: string) => void;
};

export function LinkItem({
  link,
  onToggleEnabled,
  onEdit,
  onDelete,
}: LinkProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="relative bg-background/60 backdrop-blur-sm"
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
          >
            <Grip className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <div className="font-medium">{link.title}</div>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:underline"
            >
              {link.url.length > 40
                ? `${link.url.substring(0, 40)}...`
                : link.url}
            </a>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground mr-2">
            {link.clicks} {link.clicks === 1 ? "click" : "clicks"}
          </div>
          <Switch
            checked={link.enabled}
            onCheckedChange={(checked) => onToggleEnabled(link.id, checked)}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardContent>

      <EditLinkDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        link={link}
        onSave={(title, url) => {
          onEdit(link.id, title, url);
          setIsEditDialogOpen(false);
        }}
      />

      <DeleteLinkDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        linkTitle={link.title}
        onDelete={() => {
          onDelete(link.id);
          setIsDeleteDialogOpen(false);
        }}
      />
    </Card>
  );
}
