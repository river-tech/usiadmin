import { PageHeader } from "@/components/ui/PageHeader";
import { WorkflowStats } from "@/components/workflows/WorkflowStats";
import { WorkflowTable } from "@/components/workflows/WorkflowTable";

export default function WorkflowsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Workflows"
        description="Manage and track your workflow automation templates"
      />

      <WorkflowStats />
      <WorkflowTable />
    </div>
  );
}
