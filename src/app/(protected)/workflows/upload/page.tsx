import { PageHeader } from "@/components/ui/PageHeader";
import { WorkflowForm } from "@/components/workflows/WorkflowForm";

export default function UploadWorkflowPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Upload Workflow"
        description="Create a new workflow automation template"
      />
      <WorkflowForm />
    </div>
  );
}
