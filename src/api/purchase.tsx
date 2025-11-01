import { PurchasesOverview, PurchaseListItem, PurchaseDetail, UpdatePurchaseStatusBody, ActivateDepositResponse, DepositResponse } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ===========================================================
   📊 Get Purchases Overview
   =========================================================== */
export const getPurchasesOverview = async (): Promise<{ success: boolean; data?: PurchasesOverview; error?: string }> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/purchases/overview`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const data = await response.json();
    return response.ok
      ? { success: true, data: data as PurchasesOverview }
      : { success: false, error: data.message || data.detail || "Failed to fetch purchases overview" };
  } catch (error) {
    console.error("Error fetching purchases overview:", error);
    throw error;
  }
};

/* ===========================================================
   🧾 Get Purchases List
   =========================================================== */
export const getPurchases = async (): Promise<{ success: boolean; data?: PurchaseListItem[]; error?: string }> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/purchases/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const data = await response.json();
    // API example shows { purchases: [...] }
    const purchases = Array.isArray(data?.purchases) ? (data.purchases as PurchaseListItem[]) : (data as PurchaseListItem[]);
    return response.ok
      ? { success: true, data: purchases }
      : { success: false, error: data.message || data.detail || "Failed to fetch purchases" };
  } catch (error) {
    console.error("Error fetching purchases:", error);
    throw error;
  }
};

/* ===========================================================
   🔍 Get Purchase Detail
   =========================================================== */
export const getPurchaseDetail = async (
  purchaseId: string
): Promise<{ success: boolean; data?: PurchaseDetail; error?: string }> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/purchases/${purchaseId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const data = await response.json();
    return response.ok
      ? { success: true, data: data as PurchaseDetail }
      : { success: false, error: data.message || data.detail || "Failed to fetch purchase detail" };
  } catch (error) {
    console.error("Error fetching purchase detail:", error);
    throw error;
  }
};

/* ===========================================================
   ✏️ Update Purchase Status
   =========================================================== */
export const updatePurchaseStatus = async (
  purchaseId: string,
  body: UpdatePurchaseStatusBody
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/admin/purchases/${purchaseId}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return response.ok
      ? { success: true, data }
      : { success: false, error: data.message || data.detail || "Failed to update purchase status" };
  } catch (error) {
    console.error("Error updating purchase status:", error);
    throw error;
  }
};


