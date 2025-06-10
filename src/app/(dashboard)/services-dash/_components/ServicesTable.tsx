"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteService } from "@/actions/servicesActions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

interface Service {
  id: string;
  name: string;
  description: string;
  brief_description: string;
  price_range?: string | null;
  image_url?: string | null;
  is_active: boolean;
  created_at: string;
}

interface ServicesTableProps {
  services: Service[];
}

export default function ServicesTable({ services }: ServicesTableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const result = await deleteService(id);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      toast.success("Service deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete service");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const confirmDelete = (id: string) => {
    setServiceToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price Range</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell className="max-w-xs truncate">
                {service.brief_description}
              </TableCell>
              <TableCell>{service.price_range || 'N/A'}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${service.is_active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                  {service.is_active ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell>
                {new Date(service.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.push(`/services-dash/${service.id}/edit`)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => confirmDelete(service.id)}
                    disabled={isDeleting && serviceToDelete === service.id}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => serviceToDelete && handleDelete(serviceToDelete)}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 