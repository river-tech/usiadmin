import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getAllWorkflows,
  getWorkflowOverview,
  getWorkflowDetail,
  createWorkflow,
  updateWorkflow,
  deactivateWorkflow,
  activateWorkflow,
  uploadWorkflowAsset,
  deleteWorkflowAsset,
} from "@/api/workflow";
import type { RootState } from "@/store";
import type {
  Workflow,
  AllWorkflowsResponse,
  WorkflowDashboard,
  WorkflowBody,
  WorkflowAsset,
} from "@/lib/types";
import { WorkflowStatus } from "@/lib/models";
import { getErrorMessage } from "@/lib/utils";

/* ===========================================================
   🧱 STATE
   =========================================================== */

interface WorkflowState {
  workflows: AllWorkflowsResponse[];
  selectedWorkflow: Workflow | null;
  recentCreatedWorkflows: Workflow | null;
  overview: WorkflowDashboard | null;
  isLoading: boolean;
  successMessage: string | null;
  error: string | null;
}

/* ===========================================================
   🎯 INITIAL STATE
   =========================================================== */

const initialState: WorkflowState = {
  workflows: [],
  selectedWorkflow: null,
  recentCreatedWorkflows: null,
  overview: null,
  isLoading: false,
  successMessage: null,
  error: null,
};


/* ===========================================================
   🚀 ASYNC ACTIONS
   =========================================================== */

// 🔹 1. Get all workflows
export const fetchAllWorkflows = createAsyncThunk(
  "workflows/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
     
      const result = await getAllWorkflows();
      if (!result?.success) return rejectWithValue(result?.error);
      return result.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Error fetching workflows"));
    }
  }
);

// 🔹 2. Get overview
export const fetchWorkflowOverview = createAsyncThunk(
  "workflows/fetchOverview",
  async (_, { rejectWithValue }) => {
    try {
     

      const result = await getWorkflowOverview();
      if (!result?.success) return rejectWithValue(result?.error);
      return result.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Error fetching overview"));
    }
  }
);

// 🔹 3. Get workflow detail
export const fetchWorkflowDetail = createAsyncThunk(
  "workflows/fetchDetail",
  async ({ workflowId }: { workflowId: string }, { rejectWithValue }) => {
    try {
     
      const result = await getWorkflowDetail(workflowId);
      console.log("result detail", result.data);
      if (!result?.success) return rejectWithValue(result?.error);
      return result.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Error fetching workflow detail"));
    }
  }
);

// 🔹 4. Create workflow
export const createNewWorkflow = createAsyncThunk(
  "workflows/create",
  async ({ body }: { body: WorkflowBody }, { rejectWithValue }) => {
    try {
     
      const result = await createWorkflow(body);
      if (!result?.success) return rejectWithValue(result?.error);
      return result.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Error creating workflow"));
    }
  }
);

// 🔹 5. Update workflow
export const updateExistingWorkflow = createAsyncThunk(
  "workflows/update",
  async (
    { workflowId, body }: { workflowId: string; body: WorkflowBody },
    { rejectWithValue }
  ) => {
    try {
     
      const result = await updateWorkflow(workflowId, body);
      if (!result?.success) return rejectWithValue(result?.error);
      return { id: workflowId, data: body };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Error updating workflow"));
    }
  }
);

// 🔹 6. Activate workflow
export const activateWorkflowById = createAsyncThunk(
  "workflows/activate",
  async ({ workflowId }: { workflowId: string }, { rejectWithValue }) => {
    try {
     
      const result = await activateWorkflow(workflowId);
      if (!result?.success) return rejectWithValue(result?.error);
      return workflowId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Error activating workflow"));
    }
  }
);

// 🔹 7. Deactivate workflow
export const deactivateWorkflowById = createAsyncThunk(
  "workflows/deactivate",
  async ({ workflowId }: { workflowId: string }, { rejectWithValue }) => {
    try {
     
      const result = await deactivateWorkflow(workflowId);
      if (!result?.success) return rejectWithValue(result?.error);
      return workflowId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Error deactivating workflow"));
    }
  }
);

// 🔹 8. Upload asset
export const uploadAsset = createAsyncThunk(
    "workflows/uploadAsset",
    async (
      { workflowId, payload }: { workflowId: string; payload: WorkflowAsset },
      { rejectWithValue }
    ) => {
      try {
        const result = await uploadWorkflowAsset(workflowId, payload);
  
        if (!result?.success) {
          return rejectWithValue("Upload failed");
        }
  
        // ✅ Trả trực tiếp data gốc để page có thể dùng result.payload.asset_id
        return {
          asset_id: result.data.asset_id,
          asset_url: result.data.asset_url,
        };
      } catch (error) {
        console.error("Upload asset error:", error);
        return rejectWithValue(getErrorMessage(error, "Failed to upload asset"));
      }
    }
  );

// 🔹 9. Delete asset
export const deleteAsset = createAsyncThunk(
  "workflows/deleteAsset",
  async (
    { workflowId, assetId }: { workflowId: string; assetId: string },
    { rejectWithValue }
  ) => {
    try {
     
      const result = await deleteWorkflowAsset(workflowId, assetId);
      if (!result?.success) return rejectWithValue(result?.error);
      return { workflowId, assetId };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Error deleting asset"));
    }
  }
);

/* ===========================================================
   🧠 SLICE
   =========================================================== */

const workflowSlice = createSlice({
  name: "workflows",
  initialState,
  reducers: {
    clearWorkflowState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* === Fetch All === */
      .addCase(fetchAllWorkflows.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllWorkflows.fulfilled, (state, action: PayloadAction<AllWorkflowsResponse[] | undefined>) => {
        state.isLoading = false;
        state.workflows = action.payload || [];
      })
      .addCase(fetchAllWorkflows.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      /* === Overview === */
      .addCase(fetchWorkflowOverview.fulfilled, (state, action: PayloadAction<WorkflowDashboard | undefined>) => {
        state.overview = action.payload || null;
      })

      /* === Detail === */
      .addCase(fetchWorkflowDetail.fulfilled, (state, action: PayloadAction<Workflow | undefined>) => {
        state.selectedWorkflow = action.payload || null;
      })

      /* === Create === */
      .addCase(createNewWorkflow.fulfilled, (state, action) => {
        state.workflows.push(action.payload || null);
        state.successMessage = "Workflow created successfully!";
      })
      .addCase(createNewWorkflow.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      /* === Update === */
      .addCase(updateExistingWorkflow.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        state.workflows = state.workflows.map((wf) =>
          wf.id === id ? { ...wf, ...data } : wf
        );
        state.successMessage = "Workflow updated successfully!";
      })

      /* === Activate === */
      .addCase(activateWorkflowById.fulfilled, (state, action) => {
        const id = action.payload;
        state.workflows = state.workflows.map((wf) =>
          wf.id === id ? { ...wf, status: WorkflowStatus.ACTIVE } : wf
        );
      })

      /* === Deactivate === */
      .addCase(deactivateWorkflowById.fulfilled, (state, action) => {
        const id = action.payload;
        state.workflows = state.workflows.map((wf) =>
          wf.id === id ? { ...wf, status: WorkflowStatus.EXPIRED } : wf
        );
      })

      /* === Upload Asset === */
      .addCase(uploadAsset.fulfilled, (state, action) => {
        const { asset_id, asset_url } = action.payload || {};
        const asset = { id: asset_id, url: asset_url };
        const workflowId = action.meta?.arg?.workflowId;
        if (!workflowId || !asset) return;
      
        if (state.selectedWorkflow && state.selectedWorkflow.id === workflowId) {
          if (!state.selectedWorkflow.assets) {
            state.selectedWorkflow.assets = [];
          }
          state.selectedWorkflow.assets.push(asset);
        }
      })
      
      /* === Delete Asset === */
      .addCase(deleteAsset.fulfilled, (state, action) => {
        const { workflowId, assetId } = action.payload || {};
        if (!workflowId || !assetId) return;
      
        if (state.selectedWorkflow && state.selectedWorkflow.id === workflowId) {
          state.selectedWorkflow.assets = state.selectedWorkflow.assets?.filter(
            (asset) => asset.id !== assetId
          );
        }
      })
  },
});

/* ===========================================================
   ✅ EXPORTS
   =========================================================== */

export const { clearWorkflowState } = workflowSlice.actions;
export const selectWorkflow = (state: RootState) => state.workflows;
export default workflowSlice.reducer;
