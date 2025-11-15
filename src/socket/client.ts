"use client";

// Enum để xác định các loại endpoint khác nhau
export enum WebSocketEndpoint {
  ADMIN_DEPOSITS = "admin/deposits",
  ADMIN_NOTIFICATIONS = "notifications"
}

type EndpointType = WebSocketEndpoint | string;

class WebSocketClient {
  private wsMap: Map<EndpointType, WebSocket> = new Map();
  private wsBaseUrl: string;
  private reconnectAttemptsMap: Map<EndpointType, number> = new Map();
  private maxReconnectAttempts = 5;
  private reconnectTimeouts: Map<EndpointType, ReturnType<typeof setTimeout>> = new Map();
  private listeners: Map<string, Set<(data: unknown) => void>> = new Map();

  constructor() {
    // Lấy URL cho websocket từ biến môi trường, fallback dùng API URL.
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    if (wsUrl) {
      this.wsBaseUrl = wsUrl;
    } else {
      // Chuyển từ http(s) sang ws(s)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      this.wsBaseUrl = apiUrl.replace(/^http/, "ws");
    }
  }

  // Lấy token từ local storage (key: "token")
  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  // Khởi tạo websocket cho endpoint (admin/deposits hoặc notifications)
  public connect(endpoint: EndpointType = WebSocketEndpoint.ADMIN_DEPOSITS): boolean {
    // Kiểm tra connection hiện tại
    const existingWs = this.wsMap.get(endpoint);
    if (existingWs) {
      // Nếu đang mở hoặc đang connect thì giữ nguyên
      if (existingWs.readyState === WebSocket.OPEN || existingWs.readyState === WebSocket.CONNECTING) {
        return true;
      }
      // Nếu connection đã đóng hoặc lỗi thì cleanup và tạo mới
      if (existingWs.readyState === WebSocket.CLOSED || existingWs.readyState === WebSocket.CLOSING) {
        this.wsMap.delete(endpoint);
      } else {
        // Connection cũ còn tồn tại nhưng không ở trạng thái hợp lệ, disconnect trước
        this.disconnect(endpoint);
      }
    }

    const token = this.getAuthToken();
    if (!token) {
      // Không có token thì không kết nối
      return false;
    }

    // Xây dựng endpoint cho WebSocket
    let wsEndpoint: string;
    if (
      endpoint === WebSocketEndpoint.ADMIN_DEPOSITS ||
      endpoint === WebSocketEndpoint.ADMIN_NOTIFICATIONS
    ) {
      wsEndpoint = `${this.wsBaseUrl}/ws/${endpoint}/${token}`;
    } else {
      // Hỗ trợ endpoint custom khác
      wsEndpoint = `${this.wsBaseUrl}/ws/${endpoint}/${token}`;
    }

    try {
      const ws = new WebSocket(wsEndpoint);
      this.wsMap.set(endpoint, ws);

      ws.onopen = () => {
        this.reconnectAttemptsMap.set(endpoint, 0);
        this.emit(`connected:${endpoint}`, undefined);
        
        // Setup heartbeat để giữ connection sống
        // Ping mỗi 30 giây để tránh timeout
        const heartbeatInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            try {
              ws.send(JSON.stringify({ type: "ping" }));
            } catch {
              clearInterval(heartbeatInterval);
            }
          } else {
            clearInterval(heartbeatInterval);
          }
        }, 30000);
        
        // Lưu interval để cleanup khi disconnect
        ws.addEventListener('close', () => {
          clearInterval(heartbeatInterval);
        });
      };

      ws.onmessage = (event) => {
        let data;
        try {
          data = JSON.parse(event.data);
        } catch {
          return;
        }
        // Emit đúng type (nếu có), mặc định là "message"
        if (data.type) this.emit(data.type, data);
        this.emit(`message:${endpoint}`, data);

        // Nếu message không có type nhưng có notification thì phát event "notification"
        if (!data.type && (data.id || data.notification)) {
          this.emit("notification", data);
        }
      };

      ws.onclose = (event) => {
        this.emit(`disconnected:${endpoint}`, { code: event.code, reason: event.reason });

        // Tự reconnect nếu không phải tự đóng (code != 1000) và chưa hết số lần thử lại
        const at = this.reconnectAttemptsMap.get(endpoint) ?? 0;
        if (event.code !== 1000 && at < this.maxReconnectAttempts) {
          this.reconnectAttemptsMap.set(endpoint, at + 1);
          const delay = Math.min(1000 * (at + 1), 5000); // Giới hạn max 5s
          const timeout = setTimeout(() => {
            // Kiểm tra token trước khi reconnect
            const token = this.getAuthToken();
            if (token) {
              this.connect(endpoint);
            } else {
              console.warn(`⚠️ No token found, skipping reconnect for ${endpoint}`);
            }
          }, delay);
          this.reconnectTimeouts.set(endpoint, timeout);
        } else if (event.code !== 1000 && at >= this.maxReconnectAttempts) {
          // Reset reconnect attempts sau 30 giây để có thể thử lại
          setTimeout(() => {
            this.reconnectAttemptsMap.set(endpoint, 0);
            console.log(`🔄 Reset reconnect attempts for ${endpoint}`);
          }, 30000);
        }
      };

      ws.onerror = (err) => {
        this.emit(`error:${endpoint}`, err);
      };

      return true;
    } catch {
      return false;
    }
  }

  // Thoát websocket (theo endpoint), ngắt cả reconnect timeout
  public disconnect(endpoint: EndpointType = WebSocketEndpoint.ADMIN_DEPOSITS): void {
    const timeout = this.reconnectTimeouts.get(endpoint);
    if (timeout) {
      clearTimeout(timeout);
      this.reconnectTimeouts.delete(endpoint);
    }
    const ws = this.wsMap.get(endpoint);
    if (ws) {
      ws.close(1000, "Manual disconnect");
      this.wsMap.delete(endpoint);
      this.reconnectAttemptsMap.set(endpoint, 0);
    }
  }

  // Đóng tất cả websocket
  public disconnectAll(): void {
    for (const endpoint of this.wsMap.keys()) {
      this.disconnect(endpoint);
    }
  }

  // Gửi dữ liệu qua websocket (nếu cần thiết, chủ yếu phía admin chỉ recv)
  public send(data: unknown, endpoint: EndpointType = WebSocketEndpoint.ADMIN_DEPOSITS): boolean {
    const ws = this.wsMap.get(endpoint);
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        const payload = typeof data === "string" ? data : JSON.stringify(data);
        ws.send(payload);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  // Đăng ký sự kiện
  public on(event: string, callback: (data: unknown) => void): void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(callback);
  }

  // Bỏ đăng ký sự kiện
  public off(event: string, callback?: (data: unknown) => void): void {
    const set = this.listeners.get(event);
    if (!set) return;
    if (callback) {
      set.delete(callback);
    } else {
      this.listeners.delete(event);
    }
  }

  // Kích hoạt các hàm callback đúng type
  private emit(event: string, data: unknown): void {
    const cbs = this.listeners.get(event);
    if (cbs) {
      cbs.forEach((cb) => {
        try {
          cb(data);
        } catch {
          // Do nothing
        }
      });
    }
  }

  // Check websocket còn kết nối không (1 endpoint)
  public isConnected(endpoint: EndpointType = WebSocketEndpoint.ADMIN_DEPOSITS): boolean {
    const ws = this.wsMap.get(endpoint);
    return ws?.readyState === WebSocket.OPEN;
  }

  // Lấy trạng thái websocket (1 endpoint)
  public getReadyState(endpoint: EndpointType = WebSocketEndpoint.ADMIN_DEPOSITS): number {
    const ws = this.wsMap.get(endpoint);
    return ws?.readyState ?? WebSocket.CLOSED;
  }
}

// Singleton instance
let wsClientInstance: WebSocketClient | null = null;

export const getWebSocketClient = (): WebSocketClient => {
  if (!wsClientInstance) wsClientInstance = new WebSocketClient();
  return wsClientInstance;
};

export default WebSocketClient;
