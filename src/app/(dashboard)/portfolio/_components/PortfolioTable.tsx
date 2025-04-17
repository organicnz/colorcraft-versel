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
import { deletePortfolioProject } from '@/actions/portfolioActions';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    if (!id) return;
    
    setIsDeleting(true);
    setDeleteId(id);
    
    try {
      const result = await deletePortfolioProject(id);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message || "Project deleted successfully.");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to delete project. Please try again.");
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
    <div className="border rounded-md overflow-hidden">
      <div className="p-2 bg-muted/50 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {projects.length} {projects.length === 1 ? 'project' : 'projects'} total • {projects.filter(p => p.is_featured).length} featured
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.refresh()}
                className="text-xs flex items-center"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Refresh
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh the project list</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toggleSort('title')}
                className="font-semibold flex items-center -ml-3"
              >
                Project {getSortIcon('title')}
              </Button>
            </TableHead>
            <TableHead className="w-[15%]">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toggleSort('is_featured')}
                className="font-semibold flex items-center -ml-3"
              >
                Featured {getSortIcon('is_featured')}
              </Button>
            </TableHead>
            <TableHead className="w-[20%]">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toggleSort('created_at')}
                className="font-semibold flex items-center -ml-3"
              >
                Date Added {getSortIcon('created_at')}
              </Button>
            </TableHead>
            <TableHead className="text-right w-[25%]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProjects.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                No projects found. Add your first project to get started.
              </TableCell>
            </TableRow>
          )}
          {sortedProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="min-w-[300px]">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-md overflow-hidden border">
                    {project.after_images && project.after_images[0] ? (
                      <Image
                        src={project.after_images[0]}
                        alt={project.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{project.title}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[400px]">
                      {project.brief_description}
                    </div>
                    {project.techniques && project.techniques.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {project.techniques.slice(0, 3).map((technique, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {technique}
                          </Badge>
                        ))}
                        {project.techniques.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.techniques.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {project.is_featured ? (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Featured
                  </Badge>
                ) : (
                  <Badge variant="outline">No</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {project.created_at ? (
                      format(new Date(project.created_at), 'MMM d, yyyy')
                    ) : (
                      'N/A'
                    )}
                  </span>
                  {project.completion_date && (
                    <span className="text-xs text-muted-foreground mt-1">
                      Completed: {format(new Date(project.completion_date), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/portfolio/${project.id}`} className="flex items-center">
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/portfolio/${project.id}/edit`} className="flex items-center">
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="flex items-center text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the project &quot;{project.title}&quot;. 
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(project.id)}
                            disabled={isDeleting && deleteId === project.id}
                          >
                            {isDeleting && deleteId === project.id ? 'Deleting...' : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 