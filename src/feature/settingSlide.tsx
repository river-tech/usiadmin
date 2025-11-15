import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getAllAdmins,
  createAdminAccount,
  deleteAdminAccount,
} from "@/api/auth"; // hoặc "@/api/settings" nếu bạn tách file API riêng
import type { RootState } from "@/store";
import { Admin } from "@/lib/types";
import { getErrorMessage } from "@/lib/utils";

// =============================
// 🧱 STATE STRUCTURE
// =============================


interface SettingsState {
  admins: Admin[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

// =============================
// 🧩 INITIAL STATE
// =============================
const initialState: SettingsState = {
  admins: [],
  isLoading: false,
  error: null,
  successMessage: null,
};

// =============================
// 🚀 ASYNC ACTIONS
// =============================

// 🔹 1. Lấy danh sách admin
export const fetchAdmins = createAsyncThunk(
  "settings/fetchAdmins",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found");
      const result = await getAllAdmins(token);
      if (!result?.success) return rejectWithValue(result?.error || "Failed to load admins");
      return result.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Error fetching admins"));
    }
  }
);

// 🔹 2. Tạo tài khoản admin mới
export const createAdmin = createAsyncThunk(
  "settings/createAdmin",
  async (
    {
      name,
      email,
      password,
    }: {  name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found");
      const result = await createAdminAccount(token, name, email, password);
      if (!result?.success) return rejectWithValue(result?.error || "Failed to create admin");
      return result.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Error creating admin"));
    }
  }
);

// 🔹 3. Xóa admin (với mật khẩu xác nhận)
export const removeAdmin = createAsyncThunk(
  "settings/removeAdmin",
  async (
    {
      id,
      adminPassword,
    }: { id: string; adminPassword: string },
    { rejectWithValue }
  ) => {
    try {
        console.log("id", id);
        console.log("adminPassword", adminPassword);
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found");
      const result = await deleteAdminAccount(token, id, adminPassword);
      if (!result?.success) return rejectWithValue(result?.error || "Failed to delete admin");
      return id; // chỉ cần trả id để filter khỏi state
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Error deleting admin"));
    }
  }
);

// =============================
// 🧠 SLICE DEFINITION
// =============================
export const settingSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    clearSettingsState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    /* ========== FETCH ADMINS ========== */
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action: PayloadAction<Admin[]>) => {
        state.isLoading = false;
        state.admins = action.payload;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    /* ========== CREATE ADMIN ========== */
    builder
      .addCase(createAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createAdmin.fulfilled, (state, action: PayloadAction<Admin>) => {
        state.isLoading = false;
        state.admins.push(action.payload);
        state.successMessage = "✅ Admin created successfully!";
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    /* ========== DELETE ADMIN ========== */
    builder
      .addCase(removeAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeAdmin.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.admins = state.admins.filter((admin) => admin.id !== action.payload);
        state.successMessage = "🗑️ Admin deleted successfully!";
      })
      .addCase(removeAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSettingsState } = settingSlice.actions;

// ✅ Selector
export const selectSettings = (state: RootState) => state.setting;

export default settingSlice.reducer;
