import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getCategories, postCategory, deleteCategory } from "@/api/workflow";
import type { RootState } from "@/store";
import { Category, CategoryBody } from "@/lib/types";

/* -----------------------------------
 🔹 STATE TYPE
------------------------------------ */
interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

/* -----------------------------------
 🔹 INITIAL STATE
------------------------------------ */
const initialState: CategoryState = {
  categories: [],
  isLoading: false,
  error: null,
};

/* -----------------------------------
 🔹 ASYNC THUNKS
------------------------------------ */

// 🧩 1. Get all categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const result = await getCategories();
      console.log(result);
      if (result.success) return result.data as Category[];
      return rejectWithValue(result.error || "Failed to fetch categories");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch categories");
    }
  }
);

// 🆕 2. Create category
export const createCategory = createAsyncThunk(
  "categories/create",
  async (payload: CategoryBody, { rejectWithValue }) => {
    try {
      const result = await postCategory(payload);
      if (result.success) return result.data as Category;
      return rejectWithValue(result.error || "Failed to create category");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create category");
    }
  }
);

// ❌ 3. Delete category
export const removeCategory = createAsyncThunk(
  "categories/delete",
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const result = await deleteCategory(categoryId);
      if (result.success) return categoryId;
      return rejectWithValue(result.error || "Failed to delete category");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete category");
    }
  }
);

/* -----------------------------------
 🔹 SLICE DEFINITION
------------------------------------ */
const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* === Fetch === */
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    /* === Create === */
    builder
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.isLoading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    /* === Delete === */
    builder
      .addCase(removeCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.categories = state.categories.filter((c) => c.id !== action.payload);
      })
      .addCase(removeCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

/* -----------------------------------
 🔹 SELECTOR & EXPORT
------------------------------------ */
export const selectCategories = (state: RootState) => state.categories;
export default categorySlice.reducer;