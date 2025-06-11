"use client";

import { useState } from "react";
import { User } from "@/types/database.types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface UserRoleManagementProps {
  users: User[];
  currentUserId: string;
}

export default function UserRoleManagement({ users, currentUserId }: UserRoleManagementProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [roleSelections, setRoleSelections] = useState<Record<string, string>>({});

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      if (userId === currentUserId) {
        toast.error("You cannot change your own role");
        return;
      }

      setIsUpdating(true);
      setUpdatingUserId(userId);

      const response = await fetch("/api/admin/users/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user role");
      }

      toast.success("User role updated successfully");

      // Update the state with the new role
      setRoleSelections((prev) => ({
        ...prev,
        [userId]: newRole,
      }));
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update user role");
    } finally {
      setIsUpdating(false);
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>A list of all users and their current roles</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const currentRole = roleSelections[user.id] || user.role;
            return (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={currentRole}
                    onValueChange={(value) => {
                      setRoleSelections((prev) => ({
                        ...prev,
                        [user.id]: value,
                      }));
                    }}
                    disabled={user.id === currentUserId}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="contributor">Contributor</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {user.created_at
                    ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true })
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {user.id === currentUserId ? (
                    <span className="text-sm text-slate-500">Cannot modify own role</span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleRoleChange(user.id, roleSelections[user.id] || user.role)
                      }
                      disabled={isUpdating || (roleSelections[user.id] || user.role) === user.role}
                    >
                      {isUpdating && updatingUserId === user.id
                        ? "Updating..."
                        : (roleSelections[user.id] || user.role) === user.role
                          ? "No Change"
                          : "Update Role"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
