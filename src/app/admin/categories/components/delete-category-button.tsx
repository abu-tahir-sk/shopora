"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteCategory } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteCategoryButtonProps {
  id: string;
  name: string;
  hasProducts: boolean;
}

export function DeleteCategoryButton({ id, name, hasProducts }: DeleteCategoryButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (hasProducts) {
      toast.error("Cannot delete a category that still contains products.");
      return;
    }

    if (!confirm(`Are you sure you want to delete category "${name}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCategory(id);
      toast.success(`Category "${name}" deleted`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isDeleting || hasProducts}
      title={hasProducts ? "Cannot delete category with products" : `Delete category "${name}"`}
      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
      <span className="sr-only">Delete {name}</span>
    </Button>
  );
}

