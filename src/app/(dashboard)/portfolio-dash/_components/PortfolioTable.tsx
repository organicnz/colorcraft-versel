"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Eye, 
  Star,
  ArrowUpDown,
  Calendar,
  CheckCircle,
  Info
} from 'lucide-react';
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
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { deletePortfolioProject } from '@/actions/portfolioActions';

// Define a type for the project props
type Project = {
  id: string;
  title: string;
  brief_description: string;
  description?: string;
  before_images: string[];
  after_images: string[];
  techniques?: string[];
  materials?: string[];
  completion_date?: string; // Assuming ISO date format
  client_name?: string;
  client_testimonial?: string;
  is_featured: boolean;
  created_at: string;
  updated_at?: string;
};

interface PortfolioTableProps {
  projects: Project[];
}

export default function PortfolioTable({ projects }: PortfolioTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [sortField, setSortField] = React.useState<'title' | 'created_at' | 'is_featured'>('is_featured');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');

  // Sort projects based on current sort settings
  const sortedProjects = React.useMemo(() => {
    return [...projects].sort((a, b) => {
      if (sortField === 'is_featured') {
        // Sort by featured first, then by created_at
        if (a.is_featured === b.is_featured) {
          return sortDirection === 'desc'
            ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        return sortDirection === 'desc'
          ? (a.is_featured ? -1 : 1)
          : (a.is_featured ? 1 : -1);
      } else if (sortField === 'created_at') {
        return sortDirection === 'desc'
          ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else {
        return sortDirection === 'desc'
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
      }
    });
  }, [projects, sortField, sortDirection]);

  const toggleSort = (field: 'title' | 'created_at' | 'is_featured') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    setIsDeleting(true);
    setDeleteId(id);
    
    try {
      const result = await deletePortfolioProject(id);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message || "Project deleted successfully");
        router.refresh(); // Refresh the page to reflect the deletion
      }
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast.error(error.message || "Failed to delete project");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const getSortIcon = (field: 'title' | 'created_at' | 'is_featured') => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    return sortDirection === 'asc' 
      ? <ArrowUpDown className="h-4 w-4 ml-1 rotate-180 text-primary" /> 
      : <ArrowUpDown className="h-4 w-4 ml-1 text-primary" />;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.title}</TableCell>
              <TableCell>{project.brief_description}</TableCell>
              <TableCell>{new Date(project.created_at).toLocaleDateString()}</TableCell>
              <TableCell className="text-right space-x-2">
                <Link href={`/portfolio-dash/${project.id}/edit`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(project.id)}
                  disabled={isDeleting && deleteId === project.id}
                >
                  {isDeleting && deleteId === project.id ? "Deleting..." : "Delete"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 