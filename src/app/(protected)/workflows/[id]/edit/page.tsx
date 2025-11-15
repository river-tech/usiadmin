"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { WorkflowForm } from "@/components/workflows/WorkflowForm";
import { Button } from "@/components/ui/button";
import { useAlert } from "@/contexts/AlertContext";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchWorkflowDetail,
  updateExistingWorkflow,
  selectWorkflow,
} from "@/feature/workflowSlide";
import { useEffect } from "react";
import { WorkflowBody } from "@/lib/types";
import { fetchCategories } from "@/feature/categorSlice";
import { RootState } from "@/store";

export default function EditWorkflowPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showError, showSuccess } = useAlert();
  const dispatch = useAppDispatch();

  const { selectedWorkflow: workflow, isLoading } = useAppSelector(selectWorkflow);
  const { categories } = useAppSelector((state: RootState) => state.categories);

  /* ------------------------------------------------
     🧠 Fetch workflow detail when page loads
  -------------------------------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && id) {
      dispatch(fetchWorkflowDetail({ workflowId: id.toString() }));
      dispatch(fetchCategories());
    }
  }, [dispatch, id]);

  /* ------------------------------------------------
     🧩 Handle form submission
  -------------------------------------------------- */
  const handleSubmit = async (formData: WorkflowBody) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !workflow) return;

      const resultAction = await dispatch(
        updateExistingWorkflow({  
          workflowId: workflow.id,
          body: formData as WorkflowBody,
        })
      );

      if (resultAction) {
        showSuccess("Workflow updated", "Changes have been saved successfully.");
        router.push(`/workflows/${workflow.id}`);
      } else {
        showError("Update failed", "Could not update workflow");
      }
    } catch (error) {
      console.error(error);
      showError("Error", "Something went wrong while saving.");
    }
  };

  /* ------------------------------------------------
     🗑️ Delete workflow
  -------------------------------------------------- */
  // const handleDelete = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token || !workflow) return;
  //     const resultAction = await dispatch(
  //       deactivateWorkflowById({ workflowId: workflow.id.toString() })
  //     );

  //     if (deactivateWorkflowById.fulfilled.match(resultAction)) {
  //       showSuccess("Workflow deleted", "The workflow has been deactivated.");
  //       router.push("/workflows");
  //     } else {
  //       showError("Delete failed", "Could not delete workflow.");
  //     }
  //   } catch (error) {
  //     showError("Error", "Failed to delete workflow.");
  //   }
  // };

  /* ------------------------------------------------
     🧭 Loading & Not found states
  -------------------------------------------------- */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading workflow...</p>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Workflow not found</h2>
        <p className="text-muted-foreground mb-4">
          The workflow you&apos;re trying to edit doesn&apos;t exist.
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

  /* ------------------------------------------------
     🎨 UI
  -------------------------------------------------- */
  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Workflow"
        description={`Editing: ${workflow.title}`}
      >
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/workflows">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/workflows/${workflow.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Link>
          </Button>
        </div>
      </PageHeader>

      <WorkflowForm isEdit={true} initialData={workflow} onSubmit={handleSubmit} categories={categories} />
    </div>
  );
}
