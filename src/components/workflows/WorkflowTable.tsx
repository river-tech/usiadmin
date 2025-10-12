"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Eye, Trash2, Upload } from "lucide-react";
import { mockWorkflows } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useAlert } from "@/contexts/AlertContext";

export function WorkflowTable() {
  const { showSuccess, showError } = useAlert();
  const [workflows] = useState(mockWorkflows);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    workflow: any;
  }>({ open: false, workflow: null });

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (workflow: any) => {
    setDeleteDialog({ open: true, workflow });
  };

  const confirmDelete = () => {
    try {
      // In a real app, you'd make an API call here
      console.log("Deleting workflow:", deleteDialog.workflow?.id);
      setDeleteDialog({ open: false, workflow: null });
      showSuccess("Success", `Workflow "${deleteDialog.workflow?.title}" deleted successfully!`);
    } catch (error) {
      showError("Error", "Failed to delete workflow. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80"
          />
        </div>
        <Button className="btn-gradient cursor-pointer" asChild>
          <Link href="/workflows/upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload Workflow
          </Link>
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorkflows.map((workflow) => (
              <TableRow key={workflow.id}>
                <TableCell className="font-medium">
                  <div className="space-y-1">
                    <p className="font-medium">{workflow.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {workflow.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <CategoryBadge category={workflow.category} className="text-xs px-2.5 py-0.5" />
                </TableCell>
                <TableCell className="font-medium">
                  ${workflow.price}
                </TableCell>
                <TableCell>
                  {workflow.sales}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(workflow.created), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <StatusBadge status={workflow.status} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white border shadow-lg z-50" align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/workflows/${workflow.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/workflows/${workflow.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(workflow)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, workflow: deleteDialog.workflow })}
        title="Delete Workflow"
        description={`Are you sure you want to delete "${deleteDialog.workflow?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
