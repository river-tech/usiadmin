"use client";
import { PageHeader } from "@/components/ui/PageHeader";
import { WorkflowBody } from "@/lib/types";
import { useAlert } from "@/contexts/AlertContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";
import { createNewWorkflow, uploadAsset } from "@/feature/workflowSlide";
import { WorkflowCreate } from "@/components/workflows/WorkflowCreate";
import { useEffect, useState } from "react";
import { fetchCategories } from "@/feature/categorSlice";

export default function UploadWorkflowPage() {
  const {showSuccess, showError} = useAlert();
  const dispatch = useAppDispatch();
  const {categories} = useAppSelector((state: RootState) => state.categories);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  const handleSubmit = async (formData: WorkflowBody, imagePreview: string[]) => {
    setLoading(true);
    const result = await dispatch(createNewWorkflow({ body: formData }));
    if (result) {
      for (const asset of imagePreview) {
        await dispatch(uploadAsset({
          workflowId: result.payload.id as string,
          payload: { asset_url: asset, kind: "image" },
        }));
      }
    } 
    setLoading(false);
  };
  return (
    <div className="space-y-6">
      <PageHeader
        title="Upload Workflow"
        description="Create a new workflow automation template"
      />
      <WorkflowCreate onSubmit={handleSubmit} categories={categories} loading={loading} />
    </div>
  );
}
