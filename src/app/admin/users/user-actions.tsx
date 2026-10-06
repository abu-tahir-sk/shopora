"use client";

import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, ShieldAlert, ShieldCheck, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { deleteUser, updateUserRole } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserActionsProps {
  user: {
    id: string;
    role: string;
    name: string | null;
  };
}

export function UserActions({ user }: UserActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete user ${user.name || "Unknown"}?`)) {
      return;
    }
    
    setIsDeleting(true);
    const result = await deleteUser(user.id);
    setIsDeleting(false);

    if (result.success) {
      toast.success("User deleted successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete user");
    }
  };

  const handleRoleChange = async (newRole: string) => {
    if (newRole === user.role) return;
    
    setIsUpdating(true);
    const result = await updateUserRole(user.id, newRole as any);
    setIsUpdating(false);

    if (result.success) {
      toast.success(`User role updated to ${newRole}`);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update user role");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
        className="inline-flex shrink-0 items-center justify-center rounded-md border-transparent hover:bg-muted h-8 w-8 outline-none disabled:opacity-50 disabled:pointer-events-none" 
        disabled={isDeleting || isUpdating}
      >
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm font-semibold">Actions</div>
        <DropdownMenuSeparator />
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit Role</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={user.role} onValueChange={handleRoleChange}>
              <DropdownMenuRadioItem value="CUSTOMER">
                <UserIcon className="mr-2 h-4 w-4" />
                Customer
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="SELLER">
                <ShieldAlert className="mr-2 h-4 w-4" />
                Seller
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="ADMIN">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Admin
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleDelete}
          variant="destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete User</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
