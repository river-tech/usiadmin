"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAlert } from "@/contexts/AlertContext";
import { getWebSocketClient, WebSocketEndpoint } from "./client";
import { addNewDeposit, fetchDepositList } from "@/feature/depositSlide";
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
 * Interface cho wallet_update notification
 */
interface WalletUpdateMessage {
  type: "wallet_update";
  event: "deposit_verified";
  amount: number;
  user_email?: string | null;
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
    handleNewDepositRequest?: (data: unknown) => void;
    handleWalletUpdate?: (data: WalletUpdateMessage) => void;
    handleDepositsError?: (error: unknown) => void;
    handleNotificationsError?: (error: unknown) => void;
    handleDepositsDisconnected?: (data: unknown) => void;
    handleNotificationsDisconnected?: (data: unknown) => void;
    handleNotificationUpdate?: (data: unknown) => void;
  }>({});

  // Track previous token để detect token changes
  const prevTokenRef = useRef<string | null>(null);

  useEffect(() => {
    // Lấy token từ storage (đáng tin cậy hơn Redux state sau refresh)
    const tokenFromStorage = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    // Nếu không có token trong storage, disconnect và return
    if (!tokenFromStorage) {
      const client = getWebSocketClient();
      client.disconnect(WebSocketEndpoint.ADMIN_DEPOSITS);
      client.disconnect(WebSocketEndpoint.ADMIN_NOTIFICATIONS);
      prevTokenRef.current = null;
      return;
    }
    
    // Nếu có token trong storage nhưng Redux state chưa được restore (sau refresh)
    // Vẫn tiếp tục connect, không cần đợi isAuthenticated
    if (!isAuthenticated || !token) {
      // Chỉ log, không return - sẽ connect với token từ storage
      console.log("🔄 Token found in storage but auth state not restored yet, connecting anyway...");
    }
    
    // Nếu token thay đổi, disconnect cũ và reconnect với token mới
    const tokenChanged = prevTokenRef.current !== null && prevTokenRef.current !== tokenFromStorage && tokenFromStorage;
    if (tokenChanged) {
      console.log("🔄 Token changed, reconnecting WebSocket...");
      const client = getWebSocketClient();
      // Disconnect cũ trước
      client.disconnect(WebSocketEndpoint.ADMIN_DEPOSITS);
      client.disconnect(WebSocketEndpoint.ADMIN_NOTIFICATIONS);
    }

    // Update previous token
    prevTokenRef.current = tokenFromStorage;

    if (!tokenFromStorage) {
      console.log("⚠️ No token found, skipping WebSocket connection");
      return;
    }

    // Delay nhỏ để đảm bảo token đã sẵn sàng (lâu hơn nếu token vừa thay đổi hoặc sau refresh)
    // Sau refresh, có thể cần đợi auth state được restore
    const connectDelay = tokenChanged ? 500 : (tokenFromStorage && (!isAuthenticated || !token) ? 800 : 300);
    const handlers = handlersRef.current;
    const connectTimer = setTimeout(() => {
      const currentToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
      if (!currentToken) {
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
      
      console.log("🔄 WebSocket connection initiated after refresh");

      // Handler khi connected deposits
      handlersRef.current.handleDepositsConnected = () => {
        console.log("✅ Admin WebSocket connected to deposits");
      };

      // Handler khi connected notifications
      handlersRef.current.handleNotificationsConnected = () => {
        console.log("✅ Admin WebSocket connected to notifications");
      };

      // Handler khi nhận deposit request mới
      handlersRef.current.handleNewDepositRequest = (data: unknown) => {
        const message = data as Partial<NewDepositRequestMessage> | null;
        if (
          !message ||
          typeof message !== "object" ||
          !message.transaction ||
          !message.user
        ) {
          return;
        }

        console.log("💰 New deposit request received:", message);

        // Map transaction data sang DepositResponse format
        const deposit: DepositResponse = {
          id: message.transaction.id,
          user_id: message.user.id,
          user_email: message.user.email,
          amount: message.transaction.amount,
          status: (message.transaction.status === "COMPLETED" || message.transaction.status === "SUCCESS" 
            ? "SUCCESS" 
            : message.transaction.status === "REJECTED" || message.transaction.status === "FAILED"
            ? "FAILED"
            : "PENDING") as DepositStatus,
          bank_name: message.transaction.bank_name,
          bank_account: message.transaction.bank_account,
          transfer_code: message.transaction.transfer_code,
          created_at: message.transaction.created_at,
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
          message: message.message || `User ${message.user.name} (${message.user.email}) đã yêu cầu nạp ${message.transaction.amount.toLocaleString("vi-VN")} VNĐ`,
          duration: 6000,
        });
      };

      // Handler khi có lỗi deposits
      handlersRef.current.handleDepositsError = (error: unknown) => {
        console.log("❌ WebSocket deposits error:", error);
      };

      // Handler khi có lỗi notifications
      handlersRef.current.handleNotificationsError = (error: unknown) => {
        console.log("❌ WebSocket notifications error:", error);
      };

      // Handler khi disconnect deposits
      handlersRef.current.handleDepositsDisconnected = (data: unknown) => {
        console.log("🔌 WebSocket deposits disconnected:", data);
        // Tự động reconnect nếu token vẫn còn và không phải manual disconnect
        if ((data as { code?: number })?.code !== 1000) {
          setTimeout(() => {
            const tokenFromStorage = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (tokenFromStorage) {
              console.log("🔄 Attempting to reconnect deposits WebSocket...");
              const wsClient = getWebSocketClient();
              wsClient.connect(WebSocketEndpoint.ADMIN_DEPOSITS);
            }
          }, 2000);
        }
      };

      // Handler khi disconnect notifications
      handlersRef.current.handleNotificationsDisconnected = (data: unknown) => {
        console.log("🔌 WebSocket notifications disconnected:", data);
        // Tự động reconnect nếu token vẫn còn và không phải manual disconnect
        if ((data as { code?: number })?.code !== 1000) {
          setTimeout(() => {
            const tokenFromStorage = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (tokenFromStorage) {
              console.log("🔄 Attempting to reconnect notifications WebSocket...");
              const wsClient = getWebSocketClient();
              wsClient.connect(WebSocketEndpoint.ADMIN_NOTIFICATIONS);
            }
          }, 2000);
        }
      };

      // Handler khi nhận notification mới từ notifications endpoint
      handlersRef.current.handleNotificationUpdate = (data: unknown) => {
        console.log("🔔 New notification received:", data);
        
        // Xử lý wallet_update với event deposit_verified
        if (
          typeof data === "object" &&
          data !== null &&
          "type" in data &&
          "event" in data &&
          data.type === "wallet_update" &&
          data.event === "deposit_verified"
        ) {
          const walletUpdate = data as WalletUpdateMessage;
          console.log("✅ Deposit verified notification received:", walletUpdate);
          
          // Refresh lại danh sách deposits để hiển thị cập nhật mới
          dispatch(fetchDepositList());
          dispatch(fetchDepositOverview());
          
          // Refresh notifications
          dispatch(fetchNotifications());
          
          // Hiển thị alert
          showAlert({
            type: "success",
            title: "Deposit Verified",
            message: `Deposit ${walletUpdate.amount.toLocaleString("vi-VN")} VNĐ đã được xác minh`,
            duration: 5000,
          });
        } else {
          // Các notification khác chỉ refresh notifications list
          dispatch(fetchNotifications());
        }
      };

      // Đăng ký các event listeners cho deposits
      if (handlers.handleDepositsConnected) {
        client.on(`connected:${WebSocketEndpoint.ADMIN_DEPOSITS}`, handlers.handleDepositsConnected);
      }
      if (handlers.handleNewDepositRequest) {
        client.on("new_deposit_request", handlers.handleNewDepositRequest);
      }
      if (handlers.handleDepositsError) {
        client.on(`error:${WebSocketEndpoint.ADMIN_DEPOSITS}`, handlers.handleDepositsError);
      }
      if (handlers.handleDepositsDisconnected) {
        client.on(`disconnected:${WebSocketEndpoint.ADMIN_DEPOSITS}`, handlers.handleDepositsDisconnected);
      }

      // Đăng ký các event listeners cho notifications
      if (handlers.handleNotificationsConnected) {
        client.on(`connected:${WebSocketEndpoint.ADMIN_NOTIFICATIONS}`, handlers.handleNotificationsConnected);
      }
      if (handlers.handleNotificationUpdate) {
        client.on(`message:${WebSocketEndpoint.ADMIN_NOTIFICATIONS}`, handlers.handleNotificationUpdate);
      }
      if (handlers.handleNotificationsError) {
        client.on(`error:${WebSocketEndpoint.ADMIN_NOTIFICATIONS}`, handlers.handleNotificationsError);
      }
      if (handlers.handleNotificationsDisconnected) {
        client.on(`disconnected:${WebSocketEndpoint.ADMIN_NOTIFICATIONS}`, handlers.handleNotificationsDisconnected);
      }
    }, connectDelay); // Delay để đảm bảo token đã sẵn sàng

    // Cleanup khi component unmount hoặc auth state thay đổi
    return () => {
      clearTimeout(connectTimer);
      
      const client = getWebSocketClient();
      // Remove deposits listeners (chỉ remove listeners, không disconnect connection)
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

      // Remove notifications listeners (chỉ remove listeners, không disconnect connection)
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
      
      // Chỉ disconnect khi thực sự mất auth (không có token trong storage)
      // Không disconnect khi refresh trang (token vẫn còn trong storage)
      const tokenStillExists = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if ((!isAuthenticated || !token) && !tokenStillExists) {
        client.disconnect(WebSocketEndpoint.ADMIN_DEPOSITS);
        client.disconnect(WebSocketEndpoint.ADMIN_NOTIFICATIONS);
        console.log("🔌 WebSocket disconnected (auth lost)");
      } else {
        // Khi refresh, chỉ remove listeners, connection sẽ được reconnect với listeners mới
        console.log("🔄 WebSocket listeners removed (will reconnect on remount)");
      }
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
