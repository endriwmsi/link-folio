"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { LinkItem } from "@/components/dashboard/link-item";
import { NewLinkDialog } from "@/components/dashboard/new-link-dialog";
import { LinksSkeleton } from "@/components/dashboard/links-skeleton";
import { useRouter } from "next/navigation";

type Link = {
  id: string;
  title: string;
  url: string;
  enabled: boolean;
  position: number;
  clicks: number;
};

export default function LinksPage() {
  const router = useRouter();
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewLinkDialogOpen, setIsNewLinkDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch("/api/links");
        if (!response.ok) throw new Error("Failed to fetch links");
        const data = await response.json();
        setLinks(data.links);
      } catch (error) {
        toast.error("Failed to load links");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinks();
  }, []);

  async function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex).map(
          (item, index) => ({
            ...item,
            position: index,
          })
        );

        // Update the positions in the database
        updatePositions(newItems);

        return newItems;
      });
    }
  }

  async function updatePositions(updatedLinks: Link[]) {
    try {
      const response = await fetch("/api/links/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ links: updatedLinks }),
      });

      if (!response.ok) throw new Error("Failed to update positions");

      toast.success("Links reordered successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to save new order");
      console.error(error);
    }
  }

  async function handleToggleEnabled(id: string, enabled: boolean) {
    try {
      const response = await fetch(`/api/links/${id}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enabled }),
      });

      if (!response.ok) throw new Error("Failed to update link");

      setLinks(
        links.map((link) => (link.id === id ? { ...link, enabled } : link))
      );

      toast.success(enabled ? "Link enabled" : "Link disabled");
    } catch (error) {
      toast.error("Failed to update link");
      console.error(error);
    }
  }

  async function handleAddLink(title: string, url: string) {
    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          url,
          position: links.length,
        }),
      });

      if (!response.ok) throw new Error("Failed to add link");

      const newLink = await response.json();
      setLinks([...links, newLink.link]);
      setIsNewLinkDialogOpen(false);
      toast.success("Link added successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to add link");
      console.error(error);
    }
  }

  async function handleEditLink(id: string, title: string, url: string) {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, url }),
      });

      if (!response.ok) throw new Error("Failed to update link");

      setLinks(
        links.map((link) => (link.id === id ? { ...link, title, url } : link))
      );

      toast.success("Link updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update link");
      console.error(error);
    }
  }

  async function handleDeleteLink(id: string) {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete link");

      setLinks(links.filter((link) => link.id !== id));
      toast.success("Link deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete link");
      console.error(error);
    }
  }

  if (isLoading) {
    return <LinksSkeleton />;
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Links</h1>
        <Button onClick={() => setIsNewLinkDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Link
        </Button>
      </div>

      {links.length === 0 ? (
        <Card className="p-8 flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold mb-2">No links yet</h2>
          <p className="text-muted-foreground mb-4">
            Add your first link to get started.
          </p>
          <Button onClick={() => setIsNewLinkDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Your First Link
          </Button>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={links.map((link) => link.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {links.map((link) => (
                <LinkItem
                  key={link.id}
                  link={link}
                  onToggleEnabled={handleToggleEnabled}
                  onEdit={handleEditLink}
                  onDelete={handleDeleteLink}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <NewLinkDialog
        open={isNewLinkDialogOpen}
        onOpenChange={setIsNewLinkDialogOpen}
        onAdd={handleAddLink}
      />
    </div>
  );
}
