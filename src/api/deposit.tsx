import { DepositResponse, ActivateDepositResponse, OverviewDeposit } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const listAllDeposits = async (): Promise<{ success: boolean; data?: DepositResponse[]; error?: string }> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/wallet/deposits`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const data = await response.json();
    return response.ok
      ? { success: true, data: data as DepositResponse[] }
      : { success: false, error: data.message || data.detail || "Failed to list deposits" };
  } catch (error) {
    console.error("Error listing all deposits:", error);
    throw error;
  }
};

/**
 * Get deposits overview for admin dashboard.
 * Returns stats such as total, totalAmount, completed, pending, rejected, etc.
 */
export const getOverViewDeposit = async (): Promise<{
  success: boolean;
    data?: OverviewDeposit
  error?: string;
}> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/wallet/deposits/overview`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const data = await response.json();
    return response.ok
      ? { success: true, data: data }
      : { success: false, error: data.message || data.detail || "Failed to fetch deposits overview" };
  } catch (error) {
    console.error("Error fetching deposits overview:", error);
    throw error;
  }
};

export const activateDeposit = async (
  transaction_id: string
): Promise<{ success: boolean; data?: ActivateDepositResponse; error?: string }> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/wallet/admin/activate-deposit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ transaction_id }),
    });
    const data = await response.json();
    return response.ok
      ? { success: true, data: data as ActivateDepositResponse }
      : { success: false, error: data.message || data.detail || "Failed to activate deposit" };
  } catch (error) {
    console.error("Error activating deposit:", error);
    throw error;
  }
};

export const rejectDeposit = async (
  transaction_id: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/wallet/deposits/${transaction_id}/reject`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const data = await response.json();
    return response.ok
      ? { success: true }
      : { success: false, error: data.message || data.detail || "Failed to reject deposit" };
  } catch (error) {
    console.error("Error rejecting deposit:", error);
    throw error;
  }
};