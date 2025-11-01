import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import {
  getAdminNotifications,
  createNotification,
  broadcastNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "@/api/notification";
import type {
  AdminNotification,
  CreateNotificationBody,
  BroadcastNotificationBody,
} from "@/lib/types";

interface NotificationsState {
  list: AdminNotification[];
  total: number;
  isLoading: boolean;
  selectedNotification: AdminNotification | null;
  error: string | null;
  success: boolean;
}

const initialState: NotificationsState = {
  list: [],
  total: 0,
  isLoading: false,
  selectedNotification: null,
  error: null,
  success: false,
};

// 1. Lấy danh sách notification
export const fetchNotifications = createAsyncThunk(
  "notification/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const result = await getAdminNotifications();
      console.log(result);
      if (result.success) {
        return result.data;
      }
      return rejectWithValue(result.error || "Failed to fetch notifications");
    } catch (e: any) {
      return rejectWithValue(e?.message || "Failed to fetch notifications");
    }
  }
);

// 2. Tạo 1 notification cho user cụ thể
export const createNotificationThunk = createAsyncThunk(
  "notification/create",
  async (body: CreateNotificationBody, { rejectWithValue })  => {
    try {
      console.log("Creating notification");
      const result = await createNotification(body);
      console.log(result);
      if (result.success) return result;
      return rejectWithValue(result.message || "Failed to create notification");
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error?.message || "Failed to create notification");
    }
  }
);

// 3. Broadcast notification tới tất cả user
export const broadcastNotificationThunk = createAsyncThunk(
  "notification/broadcast",
  async (body: BroadcastNotificationBody, { rejectWithValue }) => {
    try {
      const result = await broadcastNotification(body);
      if (result.success) return result;
      return rejectWithValue(result.message || "Failed to broadcast notification");
    } catch (e: any) {
      return rejectWithValue(e?.message || "Failed to broadcast notification");
    }
  }
);

// 4. Đánh dấu 1 notification đã đọc
export const markNotificationReadThunk = createAsyncThunk(
  "notification/markRead",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const result = await markNotificationAsRead(notificationId);
      if (result.success) return { notificationId };
      return rejectWithValue(result.message || "Failed to mark notification as read");
    } catch (e: any) {
      return rejectWithValue(e?.message || "Failed to mark notification as read");
    }
  }
);

// 5. Đánh dấu tất cả notification đã đọc
export const markAllNotificationsReadThunk = createAsyncThunk(
  "notification/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      const result = await markAllNotificationsAsRead();
      if (result.success) return result;
      return rejectWithValue(result.message || "Failed to mark all notifications as read");
    } catch (e: any) {
      return rejectWithValue(e?.message || "Failed to mark all notifications as read");
    }
  }
);

// 6. Xóa 1 notification
export const deleteNotificationThunk = createAsyncThunk(
  "notification/delete",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const result = await deleteNotification(notificationId);
      if (result.success) return { notificationId };
      return rejectWithValue(result.message || "Failed to delete notification");
    } catch (e: any) {
      return rejectWithValue(e?.message || "Failed to delete notification");
    }
  }
);

// 7. Xóa tất cả notification
export const deleteAllNotificationsThunk = createAsyncThunk(
  "notification/deleteAll",
  async (_, { rejectWithValue }) => {
    try {
      const result = await deleteAllNotifications();
      if (result.success) return result;
      return rejectWithValue(result.message || "Failed to delete all notifications");
    } catch (e: any) {
      return rejectWithValue(e?.message || "Failed to delete all notifications");
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.list = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    // Lấy notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<AdminNotification[] | undefined>) => {
        state.isLoading = false;
        state.list = action.payload || [];
        state.total = action.payload?.length || 0;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Tạo notification
    builder.addCase(createNotificationThunk.pending, (state) => {
      state.isLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(createNotificationThunk.fulfilled, (state) => {
      state.isLoading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(createNotificationThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Broadcast
    builder.addCase(broadcastNotificationThunk.pending, (state) => {
      state.isLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(broadcastNotificationThunk.fulfilled, (state) => {
      state.isLoading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(broadcastNotificationThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Đánh dấu 1 notification đã đọc
    builder.addCase(markNotificationReadThunk.fulfilled, (state, action: PayloadAction<{ notificationId: string }>) => {
      state.list = state.list.map((noti) =>
        noti.id === action.payload.notificationId ? { ...noti, is_unread: false } : noti
      );
    });

    // Đánh dấu tất cả đã đọc
    builder.addCase(markAllNotificationsReadThunk.fulfilled, (state) => {
      state.list = state.list.map((noti) => ({ ...noti, is_unread: false }));
    });

    // Xóa 1 notification
    builder.addCase(deleteNotificationThunk.fulfilled, (state, action: PayloadAction<{ notificationId: string }>) => {
      state.list = state.list.filter((noti) => noti.id !== action.payload.notificationId);
      state.total = Math.max(0, state.total - 1);
    });

    // Xóa tất cả
    builder.addCase(deleteAllNotificationsThunk.fulfilled, (state) => {
      state.list = [];
      state.total = 0;
    });
  },
});

export const { clearNotifications } = notificationSlice.actions;

export const selectNotificationsState = (state: RootState) => state.notification;
export const selectNotifications = (state: RootState) => state.notification.list;
export const selectUnreadNotificationCount = (state: RootState) => state.notification.list.filter(n => n.is_unread).length;
export const selectNotificationError = (state: RootState) => state.notification.error;
export const selectNotificationLoading = (state: RootState) => state.notification.isLoading;

export default notificationSlice.reducer;
