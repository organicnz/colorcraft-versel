"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteService } from "@/actions/servicesActions";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  description: string;
  brief_description: string;
  price_range?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

interface ServicesTableProps {
  services: Service[];
  isAdmin: boolean;
}

export function ServicesTable({ services, isAdmin }: ServicesTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  const handleDeleteService = async (id: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteService(id);

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: result.success,
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setServiceToDelete(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price Range</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead className="hidden md:table-cell">Date Added</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>
                {service.price_range ? (
                  formatPrice(Number(service.price_range))
                ) : (
                  <Badge variant="outline">Contact for Pricing</Badge>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell max-w-xs truncate">
                {service.description.length > 100
                  ? `${service.description.substring(0, 100)}...`
                  : service.description}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(service.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" asChild title="View Details">
                    <Link href={`/services/${service.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>

                  {isAdmin && (
                    <>
                      <Button variant="outline" size="icon" asChild title="Edit Service">
                        <Link href={`/dashboard/services-management/${service.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            title="Delete Service"
                            onClick={() => setServiceToDelete(service.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Service</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;{service.name}&quot;? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              disabled={isDeleting}
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteService(service.id);
                              }}
                            >
                              {isDeleting && serviceToDelete === service.id
                                ? "Deleting..."
                                : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
