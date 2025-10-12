import { PageHeader } from "@/components/ui/PageHeader";
import { WorkflowStats } from "@/components/workflows/WorkflowStats";
import { WorkflowTable } from "@/components/workflows/WorkflowTable";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Link from "next/link";

export default function WorkflowsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Workflows"
        description="Manage and track your workflow automation templates"
        children={
          <Button className="btn-gradient" asChild>
            <Link href="/workflows/upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload Workflow
            </Link>
          </Button>
        }
      />

      <WorkflowStats />
      <WorkflowTable />
    </div>
  );
}
