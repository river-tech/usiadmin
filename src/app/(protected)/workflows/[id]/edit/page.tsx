import { PageHeader } from "@/components/ui/PageHeader";
import { WorkflowForm } from "@/components/workflows/WorkflowForm";
import { Button } from "@/components/ui/button";
import { mockWorkflows } from "@/lib/mock-data";
import { ArrowLeft, Trash2, Eye } from "lucide-react";
import Link from "next/link";

interface EditWorkflowPageProps {
  params: {
    id: string;
  };
}

export default function EditWorkflowPage({ params }: EditWorkflowPageProps) {
  const workflow = mockWorkflows.find(w => w.id === params.id);

  if (!workflow) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Workflow not found</h2>
        <p className="text-muted-foreground mb-4">
          The workflow you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link href="/workflows">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workflows
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Workflow"
        description={`Editing: ${workflow.title}`}
        children={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/workflows">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        }
      />
      <WorkflowForm isEdit={true} initialData={workflow} />
    </div>
  );
}
