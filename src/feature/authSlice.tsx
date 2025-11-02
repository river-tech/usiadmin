import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { login, getProfile, updateProfile, changeAdminPassword } from "@/api/auth";
import type { RootState } from "@/store";
import { Admin, AuthUser } from "@/lib/types";

interface AuthState {
  user: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ✅ Không lấy token từ localStorage trong initial state để tránh hydration mismatch
const initialState: AuthState = {
  user: null,
  token: null, // Sẽ được set trong initializeAuth
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const EXPIRY_KEY = 'login_expiry';
const EXPIRY_DURATION = 60*60*1000; // 1 giờ

/* -------------------------------
 🔹 LOGIN ACTION
--------------------------------*/
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      console.log("🔐 Login attempt:", email);
      const result = await login(email, password);
      console.log("📥 Login API result:", result);
      
      if (!result?.success) {
        console.log("❌ Login failed:", result?.error);
        return rejectWithValue(result?.error?.detail || "Login failed");
      }
      
      console.log("✅ Login successful, data:", result.data);
      console.log("🔑 Token field:", result.data?.token);
      
      return result.data;
    } catch (error: any) {
      console.log("💥 Login error:", error);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);



/* -------------------------------
 🔹 GET PROFILE ACTION
--------------------------------*/
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔄 getCurrentUser - token:", token);
      if (!token) return rejectWithValue("No token found");

      const result = await getProfile(token);
      if (!result?.success) return rejectWithValue(result?.error || "Failed to load profile");
      console.log("🔄 getCurrentUser - result:", result);
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to get user data");
    }
  }
);

/* -------------------------------
 🔹 UPDATE PROFILE ACTION
--------------------------------*/
export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ name }: { name: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found");

      const result = await updateProfile(token, name);
      if (!result?.success) return rejectWithValue(result?.error || "Update failed");

      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update user profile");
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/updatePassword",
  async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found");
      const result = await changeAdminPassword(token, currentPassword, newPassword);
      if (!result?.success) return rejectWithValue(result?.error || "Failed to update password"); 
      return result.data;
    }
    catch (error: any) {
      return rejectWithValue(error.message || "Failed to update password");
    }
  }
);

/* -------------------------------
 🔹 SLICE DEFINITION
--------------------------------*/
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem(EXPIRY_KEY);
    },
    initializeAuth: (state) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const expiry = typeof window !== 'undefined' ? parseInt(localStorage.getItem(EXPIRY_KEY) || '0', 10) : 0;
      if (token && token !== 'undefined' && token !== 'null') {
        // Kiểm tra hết hạn
        if (!expiry || expiry < Date.now()) {
          // Hủy phiên
          localStorage.removeItem("token");
          localStorage.removeItem(EXPIRY_KEY);
          state.token = null;
          state.isAuthenticated = false;
      } else {
          state.token = token;
          state.isAuthenticated = true;
        }
      }
    },
  },
  extraReducers: (builder) => {
    /* ✅ LOGIN */
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthUser | undefined>) => {
        state.isLoading = false;
        const token = action.payload?.token || null;
        state.token = token;
        state.isAuthenticated = true;
        // Lưu token + hạn
        if (typeof window !== "undefined" && token) {
          localStorage.setItem("token", token);
          localStorage.setItem(EXPIRY_KEY, String(Date.now() + EXPIRY_DURATION));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = "Email or password is incorrect";
      });

    /* ✅ GET PROFILE */
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<Admin | undefined>) => {
        console.log("🔄 getCurrentUser - resultttt:", action.payload);
        state.isLoading = false;
        state.user = action.payload || null;
        console.log(`🔄 getCurrentUser - resultttt:${state.user}`);
        console.log(`🔄 getCurrentUser - state.user:${state.user?.name}`);
        console.log(`🔄 getCurrentUser - state.user:${state.user?.email}`);
        console.log(`🔄 getCurrentUser - state.user:${state.user?.role}`);
        console.log(`🔄 getCurrentUser - state.user:${state.user?.created_at}`);
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
      });

    /* ✅ UPDATE PROFILE */
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    /* ✅ CHANGE PASSWORD */
    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logoutUser, initializeAuth } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;