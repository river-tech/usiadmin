import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import {
  getPurchasesOverview,
  getPurchases,
  getPurchaseDetail,
  updatePurchaseStatus,
} from '@/api/purchase';
import type {
  PurchasesOverview,
  PurchaseListItem,
  PurchaseDetail,
  UpdatePurchaseStatusBody,
} from '@/lib/types';
import { getErrorMessage } from '@/lib/utils';

interface PurchasesState {
  overview: PurchasesOverview | null;
  list: PurchaseListItem[];
  detail: PurchaseDetail | null;
  isLoading: boolean;
  error: string | null;
  updateStatusSuccess: boolean;
  
}

const initialState: PurchasesState = {
  overview: null,
  list: [],
  detail: null,
  isLoading: false,
  error: null,
  updateStatusSuccess: false,
  
};

// 1. Get purchases overview
export const fetchPurchasesOverview = createAsyncThunk(
  'purchases/overview',
  async (_, { rejectWithValue }) => {
    try {
      const result = await getPurchasesOverview();
      if (result.success) return result.data as PurchasesOverview;
      return rejectWithValue(result.error || 'Failed to get purchases overview');
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to get purchases overview'));
    }
  }
);

// 2. Get purchases list
export const fetchPurchasesList = createAsyncThunk(
  'purchases/list',
  async (_, { rejectWithValue }) => {
    try {
      const result = await getPurchases();
      if (result.success) return result.data as PurchaseListItem[];
      return rejectWithValue(result.error || 'Failed to get purchases list');
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to get purchases list'));
    }
  }
);

// 3. Get purchase detail
export const fetchPurchaseDetail = createAsyncThunk(
  'purchases/detail',
  async (purchaseId: string, { rejectWithValue }) => {
    try {
      const result = await getPurchaseDetail(purchaseId);
      if (result.success) return result.data as PurchaseDetail;
      return rejectWithValue(result.error || 'Failed to get purchase detail');
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to get purchase detail'));
    }
  }
);

// 4. Update purchase status
export const updatePurchaseStatusThunk = createAsyncThunk(
  'purchases/updateStatus',
  async (
    payload: { purchaseId: string; body: UpdatePurchaseStatusBody },
    { rejectWithValue }
  ) => {
    try {
      const result = await updatePurchaseStatus(payload.purchaseId, payload.body);
      if (result.success) return { purchaseId: payload.purchaseId, status: payload.body.status };
      return rejectWithValue(result.error || 'Failed to update purchase status');
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to update purchase status'));
    }
  }
);

// 5. List all deposits


const purchasesSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {
    clearPurchaseDetail: state => {
      state.detail = null;
    },
    clearPurchaseError: state => {
      state.error = null;
    },
    clearStatusFlag: state => {
      state.updateStatusSuccess = false;
    }
  },
  extraReducers: builder => {
    // purchases overview
    builder.addCase(fetchPurchasesOverview.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPurchasesOverview.fulfilled, (state, action: PayloadAction<PurchasesOverview>) => {
      state.isLoading = false;
      state.overview = action.payload;
      state.error = null;
    });
    builder.addCase(fetchPurchasesOverview.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    // purchases list
    builder.addCase(fetchPurchasesList.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPurchasesList.fulfilled, (state, action: PayloadAction<PurchaseListItem[]>) => {
      state.isLoading = false;
      state.list = action.payload;
      state.error = null;
    });
    builder.addCase(fetchPurchasesList.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    // purchase detail
    builder.addCase(fetchPurchaseDetail.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPurchaseDetail.fulfilled, (state, action: PayloadAction<PurchaseDetail>) => {
      state.isLoading = false;
      state.detail = action.payload;
      state.error = null;
    });
    builder.addCase(fetchPurchaseDetail.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    // update purchase status
    builder.addCase(updatePurchaseStatusThunk.pending, state => {
      state.isLoading = true;
      state.error = null;
      state.updateStatusSuccess = false;
    });
    builder.addCase(updatePurchaseStatusThunk.fulfilled, (state, action: PayloadAction<{ purchaseId: string; status: string }>) => {
      state.isLoading = false;
      state.updateStatusSuccess = true;
      state.error = null;
      // Update status in list
      state.list = state.list.map(p => p.id === action.payload.purchaseId ? { ...p, status: action.payload.status } : p);
      // Update status in detail if it's the same
      if (state.detail && state.detail.id === action.payload.purchaseId) {
        state.detail.status = action.payload.status;
      }
    });
    builder.addCase(updatePurchaseStatusThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.updateStatusSuccess = false;
    });
    // deposits list
 
  }
});

export const { clearPurchaseDetail, clearPurchaseError, clearStatusFlag } = purchasesSlice.actions;

export const selectPurchasesState = (state: RootState) => state.purchases;
export const selectPurchasesOverview = (state: RootState) => state.purchases.overview;
export const selectPurchasesList = (state: RootState) => state.purchases.list;
export const selectPurchaseDetail = (state: RootState) => state.purchases.detail;
export const selectPurchasesLoading = (state: RootState) => state.purchases.isLoading;
export const selectPurchaseError = (state: RootState) => state.purchases.error;
export const selectUpdateStatusSuccess = (state: RootState) => state.purchases.updateStatusSuccess;

export default purchasesSlice.reducer;
