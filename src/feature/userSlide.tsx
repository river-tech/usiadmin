import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { searchUsers, getUsersOverview, getUserDetail, banUser } from "@/api/user";
import { UserSearchResponse, UsersOverview, UserDetail, BanUserBody } from "@/lib/types";

interface UsersState {
  list: UserSearchResponse[];
  overview: UsersOverview | null;
  selectedUser: UserDetail | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  list: [],
  overview: null,
  selectedUser: null,
  isLoading: false,
  error: null,
};

// Search users
export const fetchUsers = createAsyncThunk(
  "users/search",
  async (_, { rejectWithValue }) => {
    try {
      const result = await searchUsers();
      if (result.success) return result.data || [];
      return rejectWithValue(result.error || "Failed to search users");
    } catch (e: any) {
      return rejectWithValue(e?.message || "Failed to search users");
    }
  }
);

// Overview
export const fetchUsersOverview = createAsyncThunk(
  "users/overview",
  async (_, { rejectWithValue }) => {
    try {
      const result = await getUsersOverview();
      if (result.success) return result.data as UsersOverview;
      return rejectWithValue(result.error || "Failed to fetch users overview");
    } catch (e: any) {
      return rejectWithValue(e?.message || "Failed to fetch users overview");
    }
  }
);

// Detail
export const fetchUserDetail = createAsyncThunk(
  "users/detail",
  async (userId: string, { rejectWithValue }) => {
    try {
      const result = await getUserDetail(userId);
      if (result.success) return result.data as UserDetail;
      return rejectWithValue(result.error || "Failed to fetch user detail");
    } catch (e: any) {
      return rejectWithValue(e?.message || "Failed to fetch user detail");
    }
  }
);

// Ban/Unban
export const updateUserBan = createAsyncThunk(
  "users/ban",
  async (
    payload: { userId: string; body: BanUserBody },
    { rejectWithValue }
  ) => {
    try {
      const result = await banUser(payload.userId, payload.body);
      if (result.success) return { userId: payload.userId, body: payload.body };
      return rejectWithValue(result.error || "Failed to update user ban status");
    } catch (e: any) {
      return rejectWithValue(e?.message || "Failed to update user ban status");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    // search
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // overview
    builder
      .addCase(fetchUsersOverview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUsersOverview.fulfilled,
        (state, action: PayloadAction<UsersOverview>) => {
          state.isLoading = false;
          state.overview = action.payload;
        }
      )
      .addCase(fetchUsersOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // detail
    builder
      .addCase(fetchUserDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserDetail.fulfilled, (state, action: PayloadAction<UserDetail>) => {
        state.isLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ban/unban
    builder
      .addCase(updateUserBan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserBan.fulfilled, (state, action: PayloadAction<{ userId: string; body: BanUserBody }>) => {
        state.isLoading = false;
        state.list = state.list.map((user) => user.id === action.payload.userId ? { ...user, is_banned: action.payload.body.is_deleted } : user);
      })
      .addCase(updateUserBan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedUser } = usersSlice.actions;

export const selectUsersState = (state: RootState) => state.users;
export const selectUsers = (state: RootState) => state.users.list;
export const selectUsersOverview = (state: RootState) => state.users.overview;
export const selectSelectedUser = (state: RootState) => state.users.selectedUser;

export default usersSlice.reducer;


