import {
  AdminNotification,
  CreateNotificationBody,
  BroadcastNotificationBody,
  GenericSuccessResponse,
} from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ===========================================================
   20. Get Admin Notifications
   =========================================================== */
export const getAdminNotifications = async (): Promise<{
  success: boolean;
  data?: AdminNotification[];
  error?: string;
}> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/notifications`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return response.ok
      ? { success: true, data: data as AdminNotification[] }
      : { success: false, error: data.message || data.detail || "Failed to get notifications" };
  } catch (error) {
    console.error("Error getting notifications:", error);
    throw error;
  }
};

/* ===========================================================
   21. Create Notification
   =========================================================== */
export const createNotification = async (
  payload: CreateNotificationBody
): Promise<GenericSuccessResponse   > => {
  try {
    console.log("Creating notification");
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/notifications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (response.ok) {
      return { success: true, message: data.message || "Notification created successfully", };
    }
    return { success: false, message: data.message || data.detail || "Failed to create notification" };
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

/* ===========================================================
   22. Broadcast Notification to All Users
   =========================================================== */
export const broadcastNotification = async (
  payload: BroadcastNotificationBody
): Promise<GenericSuccessResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/notifications/broadcast`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return response.ok
      ? { success: true, message: data.message || "Notification broadcast to all users" }
      : { success: false, message: data.message || data.detail || "Failed to broadcast notification" };
  } catch (error) {
    console.error("Error broadcasting notification:", error);
    throw error;
  }
};

/* ===========================================================
   23. Mark Notification as Read
   =========================================================== */
export const markNotificationAsRead = async (
  notificationId: string
): Promise<GenericSuccessResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/notifications/${notificationId}/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return response.ok
      ? { success: true, message: data.message || "Notification marked as read" }
      : { success: false, message: data.message || data.detail || "Failed to mark as read" };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

/* ===========================================================
   24. Mark All Notifications as Read
   =========================================================== */
export const markAllNotificationsAsRead = async (): Promise<GenericSuccessResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/notifications/read-all`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return response.ok
      ? { success: true, message: data.message || "All notifications marked as read" }
      : { success: false, message: data.message || data.detail || "Failed to mark all as read" };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

/* ===========================================================
   25. Delete Notification
   =========================================================== */
export const deleteNotification = async (
  notificationId: string
): Promise<GenericSuccessResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/notifications/${notificationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return response.ok
      ? { success: true, message: data.message || "Notification deleted successfully" }
      : { success: false, message: data.message || data.detail || "Failed to delete notification" };
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

/* ===========================================================
   26. Delete All Notifications
   =========================================================== */
export const deleteAllNotifications = async (): Promise<GenericSuccessResponse & { deleted_count?: number }> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/notifications/all`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (response.ok) {
      return { success: true, message: data.message || "All notifications deleted", deleted_count: data.deleted_count };
    }
    return { success: false, message: data.message || data.detail || "Failed to delete all notifications" };
  } catch (error) {
    console.error("Error deleting all notifications:", error);
    throw error;
  }
};

