"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchWorkflowDetail, deactivateWorkflowById } from "@/feature/workflowSlide";
import { useAlert } from "@/contexts/AlertContext";
import { formatDistanceToNow } from "date-fns";
import { Edit, Trash2, Download, DollarSign, Play, Star, Users } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RootState } from "@/store";
import { WorkflowStatus } from "@/lib/models";

export default function WorkflowDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useAlert();

  // Redux state
  const { selectedWorkflow, isLoading } = useAppSelector((state: RootState) => state.workflows);

  const [deleteDialog, setDeleteDialog] = useState(false);

  /* -----------------------------
     Fetch detail when page mounts
  ------------------------------ */
  useEffect(() => {
    console.log("workflowId", id);
    if ( id) {
      dispatch(fetchWorkflowDetail({ workflowId: id.toString() }));
    }
    console.log(selectedWorkflow);
  }, [dispatch, id]);

  /* -----------------------------
     Handle delete
  ------------------------------ */
  const confirmDelete = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token || !selectedWorkflow) return;
      const resultAction = await dispatch(
        deactivateWorkflowById({ workflowId: selectedWorkflow.id.toString() })
      );

      if (deactivateWorkflowById.fulfilled.match(resultAction)) {
        showSuccess("Workflow deleted", "The workflow has been successfully deactivated");
        router.push("/workflows");
      } else {
        showError("Delete failed", "Could not delete workflow");
      }
    } catch (error) {
      showError("Error", "Failed to delete workflow");
    } finally {
      setDeleteDialog(false);
    }
  };

  const handleDownloadJSON = () => {
    const json = JSON.stringify(selectedWorkflow?.flow, null, 2);
    console.log(json);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedWorkflow?.title ?? "workflow"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* -----------------------------
     Loading / Empty State
  ------------------------------ */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
        Loading workflow details...
      </div>
    );
  }

  if (!selectedWorkflow) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">Workflow Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The workflow you're looking for doesn't exist.
          </p>
          <Link href="/workflows">
            <Button>Back to Workflows</Button>
          </Link>
        </div>
      </div>
    );
  }

  /* -----------------------------
     Render UI
  ------------------------------ */
  return (
    <div className="space-y-6">
      <PageHeader
        title={selectedWorkflow.title}
        description={selectedWorkflow.description}
        children={
          <div className="flex gap-2">
            <Link href={`/workflows/${selectedWorkflow.id}/edit`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="outline" onClick={() => setDeleteDialog(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Workflow Details */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow Details</CardTitle>
              <CardDescription>Complete information about this workflow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Title</label>
                  <p className="text-sm">{selectedWorkflow.title}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Categories</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                  {selectedWorkflow.categories?.length ? (
  selectedWorkflow.categories.map((c: any, idx: number) => (
    <Badge key={idx} variant="default">
      {/* Nếu c là object => dùng c.name, còn nếu là string => hiển thị trực tiếp */}
      {typeof c === "object" ? c.name || "Unnamed" : c}
    </Badge>
  ))
) : (
  <span className="text-sm text-muted-foreground">No categories</span>
)}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <StatusBadge status={selectedWorkflow.status as WorkflowStatus} />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Price</label>
                  <p className="text-sm font-medium">{selectedWorkflow.price} VND</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Time to Setup</label>
                  <p className="text-sm">{selectedWorkflow.time_to_setup} minutes</p>
                </div>

                <div className="flex flex-col gap-1 mt-2">
                  <label className="text-sm font-medium text-muted-foreground mb-1">
                    Video Demo
                  </label>
                  {selectedWorkflow.video_demo ? (
                    <div className="overflow-hidden rounded-lg border border-purple-200 bg-purple-50">
                      <video
                        src={selectedWorkflow.video_demo}
                        className="w-full h-48 object-contain border-0 transition-[box-shadow] shadow-md"
                        controls
                        poster="https://cdn-icons-png.flaticon.com/512/1161/1161910.png"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      No video available
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Features</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedWorkflow.features?.length ? (
                    selectedWorkflow.features.map((f, idx) => (
                      <Badge key={`${f}-${idx}`} variant="secondary">
                        {f}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No features</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm mt-1">{selectedWorkflow.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* JSON Flow */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow Configuration</CardTitle>
              <CardDescription>JSON configuration data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(selectedWorkflow.flow, null, 2) || "No JSON data available"}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Assets */}
          <Card>
            <CardHeader>
              <CardTitle>Assets</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedWorkflow.assets?.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {selectedWorkflow.assets.map((a, idx) => (
                   <img key={idx} src={a.url} alt="asset" className="w-full h-40 object-cover rounded-lg border shadow" />

                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No assets</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Sales</span>
                </div>
                <span className="font-medium">{selectedWorkflow.sales_count ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Revenue</span>
                </div>
                <span className="font-medium">{selectedWorkflow.price.toLocaleString()} VND</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Rating</span>
                </div>
                <span className="font-medium">{selectedWorkflow.rating ?? 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(selectedWorkflow.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(selectedWorkflow.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={() => handleDownloadJSON()} className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download JSON
              </Button>
              {/* <Button className="w-full" variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Preview Workflow
              </Button> */}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="Delete Workflow"
        description={`Are you sure you want to delete "${selectedWorkflow.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}