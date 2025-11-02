"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { AllWorkflowsResponse } from "@/lib/types";
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
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useAlert } from "@/contexts/AlertContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";
import { fetchAllWorkflows } from "@/feature/workflowSlide";
import { Workflow, WorkflowStatus } from "@/lib/models";
import { formatCurrencyVND } from "@/lib/utils";
import { deleteWorkflow ,activateWorkflow} from "@/api/workflow";

// // Giả định kiểu dữ liệu Workflow dựa trên API thực tế
// type WorkflowType = {
//   id: number | string;
//   title: string;
//   description?: string;
//   categories?: string[]; // Category array
//   price: number;
//   sales?: number;
//   created_at: string;
//   status: string;
//   // ... các trường khác nếu có
//   category?: string; // For backward compat, prefer categories
// };

export function WorkflowTable() {
  const { showSuccess, showError } = useAlert();
  const { workflows } = useAppSelector((state: RootState) => state.workflows);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllWorkflows());
  }, [dispatch]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    workflowId: string | null;
  }>({ open: false, workflowId: null });

  // Xử lý filter cho mảng categories là string[]
  const filteredWorkflows = workflows.filter((workflow: AllWorkflowsResponse) => {
    const categoriesText = workflow.categories?.length
    ? workflow.categories.join(", ")
    : "Uncategorized";
    return (
      workflow.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoriesText.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDelete = (workflowId: string) => {
    setDeleteDialog({ open: true, workflowId });
  };
  const handleActivate = async (workflowId: string) => {
      const result = await activateWorkflow(workflowId);
      if (result.success) {
        showSuccess("Workflow activated", "The workflow has been successfully activated");
        dispatch(fetchAllWorkflows());
      } else {
        showError("Activate failed", result.error || "Could not activate workflow");
      }
  };

  const confirmDelete = async () => {
    if (!deleteDialog.workflowId) return;
    
    try {
      const result = await deleteWorkflow(deleteDialog.workflowId);
      if (result.success) {
        showSuccess("Workflow deleted", "The workflow has been successfully deleted");
        // Refresh workflows list
        dispatch(fetchAllWorkflows());
      } else {
        showError("Delete failed", result.error || "Could not delete workflow");
      }
    } catch (error) {
      showError("Error", "Failed to delete workflow");
    } finally {
      setDeleteDialog({ open: false, workflowId: null });
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
            style={{ outline: "none" }}
          />
        </div>
        <Button className="btn-gradient cursor-pointer" asChild style={{ outline: "none" }}>
          <Link href="/workflows/upload" style={{ outline: "none" }}>
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
            {filteredWorkflows.map((workflow: AllWorkflowsResponse) => (
              <TableRow key={workflow.id}>
                <TableCell className="font-medium">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {workflow.title || "No description"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <CategoryBadge
                    category={
                      workflow.categories?.length
                        ? workflow.categories[0] || "Uncategorized"
                        : "Uncategorized"
                    }
                    className="text-xs px-2.5 py-0.5"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrencyVND(workflow.price)}
                </TableCell>
                <TableCell>
                  {typeof workflow.sales_count === "number" ? workflow.sales_count : "--"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {workflow?.created_at
                    ? formatDistanceToNow(new Date(workflow.created_at), {
                        addSuffix: true,
                      })
                    : "--"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={workflow?.status as WorkflowStatus} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 cursor-pointer"
                        style={{ outline: "none" }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="bg-white border focus:outline-none shadow-lg z-50"
                      align="end"
                    >
                      <DropdownMenuItem asChild>
                        <Link href={`/workflows/${workflow.id}/edit`} style={{ outline: "none" }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/workflows/${workflow.id}`} style={{ outline: "none" }}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={
                          workflow?.status === WorkflowStatus.ACTIVE
                            ? "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                            : "text-green-600 hover:text-green-700 hover:bg-green-50"
                        }
                        onClick={() =>
                          workflow?.status === WorkflowStatus.ACTIVE
                            ? handleDelete(workflow.id)
                            : handleActivate(workflow.id)
                        }
                        style={{ outline: "none" }}
                      >
                        {workflow?.status === WorkflowStatus.ACTIVE ? (
                          <>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Activate
                          </>
                        )}
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
        onOpenChange={(open) =>
          setDeleteDialog({ open, workflowId: deleteDialog.workflowId })
        }
        title="Delete Workflow"
        description={`Are you sure you want to delete this workflow? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
