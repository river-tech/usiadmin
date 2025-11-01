import { Category, CategoryBody } from "@/lib/types";
import { AllWorkflowsResponse, Workflow, WorkflowAsset, WorkflowBody, WorkflowDashboard } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ===========================================================
   🧠 6. Get All Workflows
   =========================================================== */
export const getAllWorkflows = async (): Promise<{ success: boolean; data?: AllWorkflowsResponse[]; error?: string }> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/workflows`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return response.ok
      ? { success: true, data: data as AllWorkflowsResponse[] }
      : { success: false, error: data.message || data.detail || "Failed to fetch workflows" };
  } catch (error) {
    console.error("Error fetching workflows:", error);
    throw error;
  }
};

/* ===========================================================
   📊 7. Get Workflow Overview
   =========================================================== */
export const getWorkflowOverview = async (): Promise<{ success: boolean; data?: WorkflowDashboard; error?: string }> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/workflows/overview`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return response.ok
      ? { success: true, data: data as WorkflowDashboard }
      : { success: false, error: data.message || data.detail || "Failed to fetch overview" };
  } catch (error) {
    console.error("Error getting overview:", error);
    throw error;
  }
};

/* ===========================================================
   🔍 8. Get Workflow Detail
   =========================================================== */
export const getWorkflowDetail = async (workflowId: string): Promise<{ success: boolean; data?: Workflow; error?: string }> => {
  try {
    
    const response = await fetch(`${API_URL}/api/admin/workflows/${workflowId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await response.json();
    console.log("data detail", data);
    return response.ok
      ? { success: true, data: data as Workflow }
      : { success: false, error: data.message || data.detail || "Failed to fetch workflow" };
  } catch (error) {
    console.error("Error fetching workflow detail:", error);
    throw error;
  }
};

/* ===========================================================
   ✏️ 9. Create Workflow (JSON)
   =========================================================== */
export const createWorkflow = async (payload: WorkflowBody) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/workflows/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return response.ok
      ? { success: true, data }
      : { success: false, error: data.message || data.detail || "Failed to create workflow" };
  } catch (error) {
    console.error("Error creating workflow:", error);
    throw error;
  }
};

/* ===========================================================
   📁 10. Create Workflow (With File)
   =========================================================== */
// export const getAllWorkflow = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await fetch(`${API_URL}/api/admin/workflows`, {
//       method: "GET",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await response.json();
//     return response.ok
//       ? { success: true, data }
//       : { success: false, error: data.message || data.detail || "Failed to upload workflow file" };
//   } catch (error) {
//     console.error("Error uploading workflow file:", error);
//     throw error;
//   }
// };

/* ===========================================================
   🔧 11. Update Workflow
   =========================================================== */
export const updateWorkflow = async (workflowId: string, payload: WorkflowBody) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/workflows/${workflowId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return response.ok
      ? { success: true, data }
      : { success: false, error: data.message || data.detail || "Failed to update workflow" };
  } catch (error) {
    console.error("Error updating workflow:", error);
    throw error;
  }
};

/* ===========================================================
   🧊 12. Deactivate Workflow
   =========================================================== */
export const deactivateWorkflow = async (workflowId: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/workflows/${workflowId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return response.ok
      ? { success: true, data }
      : { success: false, error: data.message || data.detail || "Failed to deactivate workflow" };
  } catch (error) {
    console.error("Error deactivating workflow:", error);
    throw error;
  }
};

/* ===========================================================
   ⚡ 13. Activate Workflow
   =========================================================== */
export const activateWorkflow = async (workflowId: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/workflows/${workflowId}/activate`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return response.ok
      ? { success: true, data }
      : { success: false, error: data.message || data.detail || "Failed to activate workflow" };
  } catch (error) {
    console.error("Error activating workflow:", error);
    throw error;
  }
};

/* ===========================================================
   🖼️ 14. Upload Workflow Asset
   =========================================================== */
export const uploadWorkflowAsset = async (
  workflowId: string,
  payload: WorkflowAsset
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/workflows/${workflowId}/assets`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return response.ok
      ? { success: true, data }
      : { success: false, error: data.message || data.detail || "Failed to upload asset" };
  } catch (error) {
    console.error("Error uploading asset:", error);
    throw error;
  }
};

/* ===========================================================
   🗑️ 15. Delete Workflow
   =========================================================== */
export const deleteWorkflow = async (workflowId: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/workflows/${workflowId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return response.ok
      ? { success: true, data }
      : { success: false, error: data.message || data.detail || "Failed to delete workflow" };
  } catch (error) {
    console.error("Error deleting workflow:", error);
    throw error;
  }
};

/* ===========================================================
   🗑️ 16. Delete Workflow Asset
   =========================================================== */
export const deleteWorkflowAsset = async (
  workflowId: string,
  assetId: string
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_URL}/api/admin/workflows/${workflowId}/assets/${assetId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    return response.ok
      ? { success: true, data }
      : { success: false, error: data.message || data.detail || "Failed to delete asset" };
  } catch (error) {
    console.error("Error deleting workflow asset:", error);
    throw error;
  }
};

export const getCategories = async (): Promise<{ success: boolean; data?: Category[]; error?: string }> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/categories`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return response.ok
      ? { success: true, data: data as Category[] }
      : { success: false, error: data.message || data.detail || "Failed to get categories" };
  } catch (error) {
    console.error("Error getting categories:", error);
    throw error;
  }
};  

export const postCategory = async (payload: CategoryBody) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/categories`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return response.ok
      ? { success: true, data }
      : { success: false, error: data.message || data.detail || "Failed to post category" };
  } catch (error) {
    console.error("Error posting category:", error);
    throw error;
  }
};


export const deleteCategory = async (categoryId: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/categories/${categoryId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return response.ok
      ? { success: true, data }
      : { success: false, error: data.message || data.detail || "Failed to delete category" };
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }  
};





