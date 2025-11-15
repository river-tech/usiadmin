import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import {
  listAllDeposits,
  getOverViewDeposit,
  activateDeposit,
  rejectDeposit,
} from "@/api/deposit";
import type {
  DepositResponse,
  OverviewDeposit,
} from "@/lib/types";
import { getErrorMessage } from "@/lib/utils";

interface DepositState {
  list: DepositResponse[];
  overview: OverviewDeposit | null;
  isLoading: boolean;
  error: string | null;
  activateSuccess: boolean;
  rejectSuccess: boolean;
}

const initialState: DepositState = {
  list: [],
  overview: null,
  isLoading: false,
  error: null,
  activateSuccess: false,
  rejectSuccess: false,
};

export const fetchDepositList = createAsyncThunk(
  "deposit/listAll",
  async (_, { rejectWithValue }) => {
    try {
      const result = await listAllDeposits();
      if (result.success) return result.data || [];
      return rejectWithValue(result.error || "Failed to fetch deposits");
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch deposits"));
    }
  }
);

export const fetchDepositOverview = createAsyncThunk(
  "deposit/overview",
  async (_, { rejectWithValue }) => {
    try {
      const result = await getOverViewDeposit();
      if (result.success) return result.data as OverviewDeposit;
      return rejectWithValue(result.error || "Failed to fetch deposit overview");
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch deposit overview"));
    }
  }
);

export const activateDepositThunk = createAsyncThunk(
  "deposit/activate",
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const result = await activateDeposit(transactionId);
      if (result.success) return transactionId;
      return rejectWithValue(result.error || "Failed to activate deposit");
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to activate deposit"));
    }
  }
);

export const rejectDepositThunk = createAsyncThunk(
  "deposit/reject",
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const result = await rejectDeposit(transactionId);
      if (result.success) return { transactionId };
      return rejectWithValue(result.error || "Failed to reject deposit");
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to reject deposit"));
    }
  }
);

const depositSlice = createSlice({
  name: "deposit",
  initialState,
  reducers: {
    clearDepositError: (state) => { state.error = null; },
    resetDepositAction: (state) => { state.activateSuccess = false; state.rejectSuccess = false; },
    addNewDeposit: (state, action: PayloadAction<DepositResponse>) => {
      // Thêm deposit mới vào đầu danh sách (prepend)
      const existing = state.list.find(d => d.id === action.payload.id);
      if (!existing) {
        state.list = [action.payload, ...state.list];
      }
    }
  },
  extraReducers: (builder) => {
    // List all deposits
    builder.addCase(fetchDepositList.pending, (state) => {
      state.isLoading = true; state.error = null;
    });
    builder.addCase(fetchDepositList.fulfilled, (state, action: PayloadAction<DepositResponse[]>) => {
      state.isLoading = false;
      state.list = action.payload;
      state.error = null;
    });
    builder.addCase(fetchDepositList.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Overview
    builder.addCase(fetchDepositOverview.pending, (state) => {
      state.isLoading = true; state.error = null;
    });
    builder.addCase(fetchDepositOverview.fulfilled, (state, action: PayloadAction<OverviewDeposit>) => {
      state.isLoading = false; state.overview = action.payload; state.error = null;
    });
    builder.addCase(fetchDepositOverview.rejected, (state, action) => {
      state.isLoading = false; state.error = action.payload as string;
    });

    // Activate deposit
    builder.addCase(activateDepositThunk.pending, (state) => {
      state.isLoading = true; state.activateSuccess = false; state.error = null;
    });
    builder.addCase(activateDepositThunk.fulfilled, (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.activateSuccess = true;
      state.error = null;
      // Đảm bảo giá trị status là hợp lệ với kiểu DepositStatus
      state.list = state.list.map(deposit =>
        deposit.id === action.payload ? { ...deposit, status: "SUCCESS" as typeof deposit.status } : deposit
      );
    });
    builder.addCase(activateDepositThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.activateSuccess = false;
      state.error = action.payload as string;
    });

    // Reject deposit
    builder.addCase(rejectDepositThunk.pending, (state) => {
      state.isLoading = true; state.rejectSuccess = false; state.error = null;
    });
    builder.addCase(rejectDepositThunk.fulfilled, (state, action: PayloadAction<{ transactionId: string }>) => {
      state.isLoading = false; state.rejectSuccess = true; state.error = null;
      state.list = state.list.map(deposit =>
        deposit.id === action.payload.transactionId ? { ...deposit, status: "FAILED" as typeof deposit.status } : deposit
      );
    });
    builder.addCase(rejectDepositThunk.rejected, (state, action) => {
      state.isLoading = false; state.rejectSuccess = false; state.error = action.payload as string;
    });
  }
});

export const { clearDepositError, resetDepositAction, addNewDeposit } = depositSlice.actions;

export const selectDeposits = (state: RootState) => state.deposits.list;
export const selectDepositLoading = (state: RootState) => state.deposits.isLoading;
export const selectDepositError = (state: RootState) => state.deposits.error;
export const selectDepositOverview = (state: RootState) => state.deposits.overview;
export const selectDepositActivateSuccess = (state: RootState) => state.deposits.activateSuccess;
export const selectDepositRejectSuccess = (state: RootState) => state.deposits.rejectSuccess;

export default depositSlice.reducer;
