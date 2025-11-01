import { UserSearchResponse, UsersOverview, UserDetail, BanUserBody } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ===========================================================
   🔍 1. Search Users
   =========================================================== */
export const searchUsers = async (
 
): Promise<{ success: boolean; data?: UserSearchResponse[]; error?: string }> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data)
    return response.ok
      ? { success: true, data: data as UserSearchResponse[] }
      : { success: false, error: data.message || data.detail || "Failed to search users" };
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

/* ===========================================================
   📊 2. Get Users Overview
   =========================================================== */
export const getUsersOverview = async (): Promise<{
  success: boolean;
  data?: UsersOverview;
  error?: string;
}> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/users/overview`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return response.ok
      ? { success: true, data: data as UsersOverview }
      : {
          success: false,
          error: data.message || data.detail || "Failed to fetch users overview",
        };
  } catch (error) {
    console.error("Error fetching users overview:", error);
    throw error;
  }
};

/* ===========================================================
   👤 3. Get User Detail
   =========================================================== */
export const getUserDetail = async (
  userId: string
): Promise<{ success: boolean; data?: UserDetail; error?: string }> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return response.ok
      ? { success: true, data: data as UserDetail }
      : {
          success: false,
          error: data.message || data.detail || "Failed to fetch user detail",
        };
  } catch (error) {
    console.error("Error fetching user detail:", error);
    throw error;
  }
};

/* ===========================================================
   🚫 4. Ban/Unban User
   =========================================================== */
export const banUser = async (
  userId: string,
  body: BanUserBody
): Promise<{ success: boolean; error?: string }> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/users/${userId}/ban`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response.ok
      ? { success: true }
      : { success: false, error: "Failed to update user ban status" };
  } catch (error) {
    console.error("Error updating user ban status:", error);
    throw error;
  }
};

