"use client";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { mockWorkflows } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";
import { 
  Edit, 
  Trash2, 
  Download, 
  DollarSign, 
  Play,
  Star,
  Users
} from "lucide-react";
import Link from "next/link";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function WorkflowDetailPage() {
  const params = useParams();
  const [workflow, setWorkflow] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    const found = mockWorkflows.find(w => w.id === params.id);
    if (!found) {
      setWorkflow(null);
      return;
    }
    const normalized: any = {
      id: found.id,
      title: found.title,
      description: found.description,
      price: found.price,
      status: found.status,
      // features may be named categories in older mocks
      categories: found.categories || [],
      timeToSetup: found.timeToSetup ?? 0,
      videoDemo: found.videoDemo ?? "",
      jsonData: found.jsonData ?? {},
      sales: found.sales ?? 0,
      revenue: found.revenue ?? 0,
      created: found.created ?? new Date().toISOString(),
      updated: found.updated ?? new Date().toISOString()
    };
    setWorkflow(normalized);
  }, [params.id]);

  if (!workflow) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">Workflow Not Found</h2>
          <p className="text-muted-foreground mb-4">The workflow you're looking for doesn't exist.</p>
          <Link href="/workflows">
            <Button>Back to Workflows</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    setDeleteDialog(true);
  };

  const confirmDelete = () => {
    // In a real app, you'd make an API call here
    console.log("Deleting workflow:", workflow.id);
    setDeleteDialog(false);
    // Redirect to workflows list
    window.location.href = "/workflows";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={workflow.title}
        description={workflow.description}
        children={
          <div className="flex gap-2">
            <Link href={`/workflows/${workflow.id}/edit`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="outline" onClick={handleDelete}>
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
              <CardDescription>
                Complete information about this workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Title</label>
                  <p className="text-sm">{workflow.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Categories</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {workflow.categories?.length > 0 ? (
                      workflow.categories.map((c: {id: string; name: string}) => (
                        <Badge key={c.id} variant="secondary">{c.name}</Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No categories</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <StatusBadge status={workflow.status} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Price</label>
                  <p className="text-sm font-medium">${workflow.price}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Time to Setup</label>
                  <p className="text-sm">{workflow.time_to_setup} minutes</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Video Demo</label>
                  {workflow.video_demo ? (
                    <a href={workflow.video_demo} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm">Open video</a>
                  ) : (
                    <p className="text-sm text-muted-foreground">No video</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm mt-1">{workflow.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Features</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {workflow.features?.length > 0 ? (
                    workflow.features.map((f: string, idx: number) => (
                      <Badge key={`${f}-${idx}`} variant="secondary">{f}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No features</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* JSON Flow Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow Configuration</CardTitle>
              <CardDescription>
                JSON configuration data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(workflow.flow, null, 2) || "No JSON data available"}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Assets */}
          <Card>
            <CardHeader>
              <CardTitle>Assets</CardTitle>
              <CardDescription>Images, videos or documents attached to this workflow</CardDescription>
            </CardHeader>
            <CardContent>
              {workflow.assets?.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {workflow.assets.map((a: {id: string; asset_url: string; kind: string}) => (
                    <div key={a.id} className="border rounded-lg overflow-hidden">
                      {a.kind === 'image' ? (
                        <img src={a.asset_url} alt="asset" className="w-full h-40 object-cover" />
                      ) : (
                        <div className="p-4 text-sm">{a.kind.toUpperCase()}</div>
                      )}
                      <div className="p-3 text-xs truncate">
                        <a href={a.asset_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">{a.asset_url}</a>
                      </div>
                    </div>
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
          {/* Stats */}
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
                <span className="font-medium">{workflow.sales}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Revenue</span>
                </div>
                <span className="font-medium">${workflow.revenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Rating</span>
                </div>
                <span className="font-medium">4.5/5</span>
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
                    {formatDistanceToNow(new Date(workflow.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(workflow.updated_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download JSON
              </Button>
              <Button className="w-full" variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Preview Workflow
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="Delete Workflow"
        description={`Are you sure you want to delete "${workflow.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
