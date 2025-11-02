"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAlert } from "@/contexts/AlertContext";
import { getWebSocketClient, WebSocketEndpoint } from "./client";
import { addNewDeposit } from "@/feature/depositSlide";
import { fetchNotifications } from "@/feature/notificationSlide";
import { fetchDepositOverview } from "@/feature/depositSlide";
import { selectAuth } from "@/feature/authSlice";
import type { DepositResponse, DepositStatus } from "@/lib/types";

/**
 * Interface cho WebSocket message từ server
 */
interface NewDepositRequestMessage {
  type: "new_deposit_request";
  event: "deposit_created";
  transaction: {
    id: string;
    status: string;
    amount: number;
    bank_name: string;
    bank_account: string;
    transfer_code: string;
    created_at: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  notification?: {
    id: string;
    title: string;
    message: string;
    type: string;
    is_unread: boolean;
    created_at: string;
  };
  message: string;
  timestamp: string;
}

/**
 * Custom hook để quản lý WebSocket connection cho admin deposits
 * Tự động connect/disconnect, xử lý alerts và cập nhật Redux state
 */
export function useAdminWebSocket() {
  const dispatch = useAppDispatch();
  const { showAlert, showError } = useAlert();
  const { isAuthenticated, token } = useAppSelector(selectAuth);
  const handlersRef = useRef<{
    handleDepositsConnected?: () => void;
    handleNotificationsConnected?: () => void;
    handleNewDepositRequest?: (data: NewDepositRequestMessage) => void;
    handleDepositsError?: (error: any) => void;
    handleNotificationsError?: (error: any) => void;
    handleDepositsDisconnected?: (data: any) => void;
    handleNotificationsDisconnected?: (data: any) => void;
    handleNotificationUpdate?: (data: any) => void;
  }>({});

  useEffect(() => {
    // Đợi auth state được initialize và có token
    if (!isAuthenticated || !token) {
      return;
    }

    // Delay nhỏ để đảm bảo token đã sẵn sàng
    const connectTimer = setTimeout(() => {
      const tokenFromStorage = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
      if (!tokenFromStorage) {
        console.log("⚠️ No token found, skipping WebSocket connection");
        return;
      }

      const client = getWebSocketClient();

      // Connect đến cả 2 endpoints: admin/deposits và notifications
      const connectedDeposits = client.connect(WebSocketEndpoint.ADMIN_DEPOSITS);
      const connectedNotifications = client.connect(WebSocketEndpoint.ADMIN_NOTIFICATIONS);
      
      if (!connectedDeposits && !connectedNotifications) {
        console.warn("⚠️ Failed to connect WebSocket");
        return;
      }

      // Handler khi connected deposits
      handlersRef.current.handleDepositsConnected = () => {
        console.log("✅ Admin WebSocket connected to deposits");
      };

      // Handler khi connected notifications
      handlersRef.current.handleNotificationsConnected = () => {
        console.log("✅ Admin WebSocket connected to notifications");
      };

      // Handler khi nhận deposit request mới
      handlersRef.current.handleNewDepositRequest = (data: NewDepositRequestMessage) => {
        console.log("💰 New deposit request received:", data);

        // Map transaction data sang DepositResponse format
        const deposit: DepositResponse = {
          id: data.transaction.id,
          user_id: data.user.id,
          user_email: data.user.email,
          amount: data.transaction.amount,
          status: (data.transaction.status === "COMPLETED" || data.transaction.status === "SUCCESS" 
            ? "SUCCESS" 
            : data.transaction.status === "REJECTED" || data.transaction.status === "FAILED"
            ? "FAILED"
            : "PENDING") as DepositStatus,
          bank_name: data.transaction.bank_name,
          bank_account: data.transaction.bank_account,
          transfer_code: data.transaction.transfer_code,
          created_at: data.transaction.created_at,
        };

        // Thêm deposit mới vào Redux store
        dispatch(addNewDeposit(deposit));

        // Refresh notifications để hiển thị notification mới
        dispatch(fetchNotifications());

        // Refresh overview để cập nhật số lượng pending deposits
        dispatch(fetchDepositOverview());

        // Hiển thị alert/toast
        showAlert({
          type: "success",
          title: "New Deposit Request",
          message: data.message || `User ${data.user.name} (${data.user.email}) đã yêu cầu nạp ${data.transaction.amount.toLocaleString("vi-VN")} VNĐ`,
          duration: 6000,
        });
      };

      // Handler khi có lỗi deposits
      handlersRef.current.handleDepositsError = (error: any) => {
        console.error("❌ WebSocket deposits error:", error);
      };

      // Handler khi có lỗi notifications
      handlersRef.current.handleNotificationsError = (error: any) => {
        console.error("❌ WebSocket notifications error:", error);
      };

      // Handler khi disconnect deposits
      handlersRef.current.handleDepositsDisconnected = (data: any) => {
        console.log("🔌 WebSocket deposits disconnected:", data);
      };

      // Handler khi disconnect notifications
      handlersRef.current.handleNotificationsDisconnected = (data: any) => {
        console.log("🔌 WebSocket notifications disconnected:", data);
      };

      // Handler khi nhận notification mới từ notifications endpoint
      handlersRef.current.handleNotificationUpdate = (data: any) => {
        console.log("🔔 New notification received:", data);
        // Refresh notifications list
        dispatch(fetchNotifications());
      };

      // Đăng ký các event listeners cho deposits
      if (handlersRef.current.handleDepositsConnected) {
        client.on(`connected:${WebSocketEndpoint.ADMIN_DEPOSITS}`, handlersRef.current.handleDepositsConnected);
      }
      if (handlersRef.current.handleNewDepositRequest) {
        client.on("new_deposit_request", handlersRef.current.handleNewDepositRequest);
      }
      if (handlersRef.current.handleDepositsError) {
        client.on(`error:${WebSocketEndpoint.ADMIN_DEPOSITS}`, handlersRef.current.handleDepositsError);
      }
      if (handlersRef.current.handleDepositsDisconnected) {
        client.on(`disconnected:${WebSocketEndpoint.ADMIN_DEPOSITS}`, handlersRef.current.handleDepositsDisconnected);
      }

      // Đăng ký các event listeners cho notifications
      if (handlersRef.current.handleNotificationsConnected) {
        client.on(`connected:${WebSocketEndpoint.ADMIN_NOTIFICATIONS}`, handlersRef.current.handleNotificationsConnected);
      }
      if (handlersRef.current.handleNotificationUpdate) {
        client.on(`message:${WebSocketEndpoint.ADMIN_NOTIFICATIONS}`, handlersRef.current.handleNotificationUpdate);
      }
      if (handlersRef.current.handleNotificationsError) {
        client.on(`error:${WebSocketEndpoint.ADMIN_NOTIFICATIONS}`, handlersRef.current.handleNotificationsError);
      }
      if (handlersRef.current.handleNotificationsDisconnected) {
        client.on(`disconnected:${WebSocketEndpoint.ADMIN_NOTIFICATIONS}`, handlersRef.current.handleNotificationsDisconnected);
      }
    }, 300); // Delay 300ms để đảm bảo token đã sẵn sàng

    // Cleanup khi component unmount hoặc auth state thay đổi
    return () => {
      clearTimeout(connectTimer);
      
      const client = getWebSocketClient();
      const handlers = handlersRef.current;
      
      // Remove deposits listeners
      if (handlers.handleDepositsConnected) {
        client.off(`connected:${WebSocketEndpoint.ADMIN_DEPOSITS}`, handlers.handleDepositsConnected);
      }
      if (handlers.handleNewDepositRequest) {
        client.off("new_deposit_request", handlers.handleNewDepositRequest);
      }
      if (handlers.handleDepositsError) {
        client.off(`error:${WebSocketEndpoint.ADMIN_DEPOSITS}`, handlers.handleDepositsError);
      }
      if (handlers.handleDepositsDisconnected) {
        client.off(`disconnected:${WebSocketEndpoint.ADMIN_DEPOSITS}`, handlers.handleDepositsDisconnected);
      }

      // Remove notifications listeners
      if (handlers.handleNotificationsConnected) {
        client.off(`connected:${WebSocketEndpoint.ADMIN_NOTIFICATIONS}`, handlers.handleNotificationsConnected);
      }
      if (handlers.handleNotificationUpdate) {
        client.off(`message:${WebSocketEndpoint.ADMIN_NOTIFICATIONS}`, handlers.handleNotificationUpdate);
      }
      if (handlers.handleNotificationsError) {
        client.off(`error:${WebSocketEndpoint.ADMIN_NOTIFICATIONS}`, handlers.handleNotificationsError);
      }
      if (handlers.handleNotificationsDisconnected) {
        client.off(`disconnected:${WebSocketEndpoint.ADMIN_NOTIFICATIONS}`, handlers.handleNotificationsDisconnected);
      }
      
      // Disconnect cả 2 WebSocket khi unmount
      client.disconnect(WebSocketEndpoint.ADMIN_DEPOSITS);
      client.disconnect(WebSocketEndpoint.ADMIN_NOTIFICATIONS);
      console.log("🔌 WebSocket disconnected (cleanup)");
    };
  }, [dispatch, showAlert, showError, isAuthenticated, token]);

  // Return client instance và helper methods
  return {
    client: getWebSocketClient(),
    isConnected: () => {
      const client = getWebSocketClient();
      return client.isConnected(WebSocketEndpoint.ADMIN_DEPOSITS) || client.isConnected(WebSocketEndpoint.ADMIN_NOTIFICATIONS);
    },
    reconnect: () => {
      const client = getWebSocketClient();
      client.disconnect(WebSocketEndpoint.ADMIN_DEPOSITS);
      client.disconnect(WebSocketEndpoint.ADMIN_NOTIFICATIONS);
      setTimeout(() => {
        client.connect(WebSocketEndpoint.ADMIN_DEPOSITS);
        client.connect(WebSocketEndpoint.ADMIN_NOTIFICATIONS);
      }, 1000);
    },
  };
}
