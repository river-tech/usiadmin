import { WorkflowStatus } from "./models";
export enum DepositStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}
export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string 
}

export interface AuthUser {
    success: boolean;
    token: string;
    user: Admin;
    expires_in: number;
}

export interface Asset {
  id: string;
  url: string;
}


export interface Workflow {
  id: string;
  title: string;
  description: string;
  price: number;
  rating :number;
  features: string[];
  time_to_setup: number;
  video_demo: string;
  flow: Record<string, unknown>;
  categories: string[];
  sales_count: number;
  created_at: string;
  status: WorkflowStatus;
  assets: {
    id: string;
    url: string;
  }[];
}



export interface AllWorkflowsResponse {
  id: string;
  title: string;
  categories: string[];
  price: number;
  sales_count: number;
  created_at: string;
  status: WorkflowStatus;
}

export interface WorkflowBody{
    title: string;
    description: string;
    price: number;
    features: string[];
    time_to_setup: number;
    video_demo: string;
    flow: Record<string, unknown>;
    category_ids: string[];
}

export interface WorkflowAsset {
  asset_url: string;
  kind: string;
}

export interface WorkflowDashboard {
  total_workflows: number;
  active_workflows: number;
  total_sales: number;
  total_revenue: number;
}


export interface Category {
  id: string;
  name: string;
  image_url: string;
}

export interface CategoryBody{
  name: string;
  image_url: string;
}

// User types
export interface UserSearchResponse {
    id: string;
    avatar_url: string;
    name: string;
    email: string;
    created_at: string;
    purchases_count: number;
    total_spent: number;
    is_banned: boolean;
}

export interface UsersOverview {
  total_users: number;
  active_users: number;
  total_purchases: number;
  total_spent: number;
}

export interface UserDetail {
  id: string;
  avatar_url: string;
  name: string;
  email: string;
  joined_at: string;
  status: string;
  total_purchases: number;
  total_spent: number;
  avg_order_value: number;
  purchase_history: UserPurchase[];
}

export interface UserPurchase {
 
  workflow_id: string;
  workflow_title: string;
  price: number;
  status: string;
  purchased_at: string;
}

export interface BanUserBody {
  is_deleted: boolean;
}

export interface UserSearchResponse {
    id: string;
    avatar_url: string;
    name: string;
    email: string;
    created_at: string;
    purchases_count: number;
    total_spent: number;
    is_banned: boolean;
}

// Purchases types
export interface PurchasesOverview {
  total_purchases: number;
  completed: number;
  pending: number;
  total_revenue: number;
}

export interface PurchaseListItem {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  workflow: {
    id: string;
    title: string;
    price: number;
  };
  amount: number;
  status: string; // e.g., ACTIVE, PENDING, REJECT
  payment_method: string; // e.g., WALLET, BANK_TRANSFER
  paid_at: string;
}

export interface ActivateDepositResponse{
  success: boolean;
  message: string;
  transaction_id: string;
  user_id: string;
  amount: number;
  new_wallet_balance: number;
}

export interface DepositResponse{
  
    id: string;
    user_id: string;
    user_email: string;
    amount: number;
    status: DepositStatus;
    bank_name: string;
    bank_account: string;
    transfer_code: string;
    created_at: string;
  
}
export interface PurchaseDetail {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  workflow: {
    id: string;
    title: string;
    price: number;
  };
  bank_name?: string;
  transfer_code?: string;
  status: string;
  amount: number;
  paid_at: string;
}

export interface UpdatePurchaseStatusBody {
  status: string; // PENDING | ACTIVE | REJECT
}

// Notifications
export type AdminNotificationType = "SUCCESS" | "WARNING" | "ERROR" | string;

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: AdminNotificationType;
  is_unread: boolean;
}

export interface AdminNotificationsResponse {
  items: AdminNotification[];
  total: number;
}

export interface CreateNotificationBody {
  user_id: string;
  title: string;
  message: string;
  type: AdminNotificationType;
}

export interface BroadcastNotificationBody {
  title: string;
  message: string;
  type: AdminNotificationType;
}

export interface GenericSuccessResponse {
  success: boolean;
  message: string;
}

export interface OverviewDeposit{
  total: number;
  total_amount: number;
  completed: number;
  pending: number;
  rejected: number;
}

export type UserStatus = 'active' | 'inactive' | 'banned';
export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  joinDate: string;
  purchases: number;
  totalSpent: number;
  status: UserStatus;
  is_banned: boolean;
}

export type MockPurchaseStatus = 'ACTIVE' | 'PENDING' | 'REJECT';
export interface Purchase {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  workflowId: string;
  workflowTitle: string;
  amount: number;
  date: string;
  paymentMethod: string;
  status: MockPurchaseStatus;
  transactionId: string;
}

export interface Activity {
  id: string;
  admin: string;
  action: string;
  target: string;
  timestamp: string;
  details?: string;
}

export interface MockWorkflow {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  sales: number;
  revenue: number;
  created: string;
  updated: string;
  status: WorkflowStatus;
  categories: string[];
  jsonData: string;
  timeToSetup: number;
  videoDemo: string;
}

export interface Analytics {
  totalSales: number;
  totalRevenue: number;
  activeUsers: number;
  totalUsers: number;
  monthlyRevenue: number;
  workflowCategories: {
    category: string;
    count: number;
    revenue: number;
  }[];
  topWorkflows: {
    id: string;
    title: string;
    sales: number;
    revenue: number;
  }[];
  revenueChart: {
    date: string;
    revenue: number;
  }[];
}

export interface StorageSettings {
  maxFileSize: number;
  allowedTypes: string[];
  storageProvider: 'local' | 'aws' | 'gcp';
  awsConfig?: {
    bucket: string;
    region: string;
    accessKey: string;
  };
}

export interface StripeSettings {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  enabled: boolean;
}

export interface MaintenanceSettings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  allowedIPs: string[];
}

export interface NotificationSettings {
  emailNotifications: boolean;
  slackWebhook?: string;
  discordWebhook?: string;
  adminEmails: string[];
}

export interface Settings {
  storage: StorageSettings;
  stripe: StripeSettings;
  maintenance: MaintenanceSettings;
  notifications: NotificationSettings;
}

// // Workflow types
// export interface Workflow {
//   id: string;
//   title: string;
//   description: string;
//   category: string;
//   price: number;
//   sales: number;
//   revenue: number;
//   created: string;
//   updated: string;
//   status: 'active' | 'expired'; // Use database enum values
//   categories: string[]; // Map to categories array
//   jsonData?: string; // Map to flow jsonb
//   timeToSetup?: number; // Map to time_to_setup
//   videoDemo?: string; // Map to video_demo
//   // previewImage sẽ được lấy từ workflow_assets table với kind = 'image'
// }

// // Purchase types
// export interface Purchase {
//   id: string;
//   userId: string;
//   userName: string;
//   userEmail: string;
//   workflowId: string;
//   workflowTitle: string;
//   amount: number;
//   date: string;
//   paymentMethod: 'QR'; // Use database enum value
//   status: 'ACTIVE' | 'PENDING' | 'REJECT'; // Use database enum values
//   transactionId: string; // Map to transfer_code
// }

// // Activity/Log types
// export interface Activity {
//   id: string;
//   admin: string;
//   action: string;
//   target: string;
//   timestamp: string;
//   details?: string;
// }

// // Analytics types
// export interface Analytics {
//   totalSales: number;
//   totalRevenue: number;
//   activeUsers: number;
//   totalUsers: number;
//   monthlyRevenue: number;
//   workflowCategories: {
//     category: string;
//     count: number;
//     revenue: number;
//   }[];
//   topWorkflows: {
//     id: string;
//     title: string;
//     sales: number;
//     revenue: number;
//   }[];
//   revenueChart: {
//     date: string;
//     revenue: number;
//   }[];
// }

// // Settings types
// export interface StorageSettings {
//   maxFileSize: number;
//   allowedTypes: string[];
//   storageProvider: 'local' | 'aws' | 'gcp';
//   awsConfig?: {
//     bucket: string;
//     region: string;
//     accessKey: string;
//   };
// }

// export interface StripeSettings {
//   publishableKey: string;
//   secretKey: string;
//   webhookSecret: string;
//   enabled: boolean;
// }

// export interface MaintenanceSettings {
//   maintenanceMode: boolean;
//   maintenanceMessage: string;
//   allowedIPs: string[];
// }

// export interface NotificationSettings {
//   emailNotifications: boolean;
//   slackWebhook?: string;
//   discordWebhook?: string;
//   adminEmails: string[];
// }

// export interface Settings {
//   storage: StorageSettings;
//   stripe: StripeSettings;
//   maintenance: MaintenanceSettings;
//   notifications: NotificationSettings;
// }

// // UI Component types
// export interface StatCardProps {
//   title: string;
//   value: string | number;
//   trend?: {
//     value: number;
//     isPositive: boolean;
//   };
//   icon?: React.ReactNode;
//   description?: string;
// }

// export interface StatusBadgeProps {
//   status: 'active' | 'inactive' | 'ACTIVE' | 'PENDING' | 'REJECT' | 'expired';
//   variant?: 'default' | 'secondary' | 'destructive' | 'outline';
// }

// // Navigation types
// export interface NavItem {
//   title: string;
//   href: string;
//   icon: React.ReactNode;
//   badge?: string;
//   children?: NavItem[];
// }

// // Form types
// export interface WorkflowFormData {
//   title: string;
//   description: string;
//   category: string;
//   price: number;
//   categories: string[];
//   previewImage?: File;
//   jsonData?: string;
// }

// export interface UserFormData {
//   name: string;
//   email: string;
//   status: 'active' | 'inactive'; // Map to is_deleted
// }

// // Filter types
// export interface FilterOptions {
//   search: string;
//   status?: string;
//   dateRange?: {
//     from: string;
//     to: string;
//   };
//   category?: string;
// }

// // Table types
// export interface TableColumn<T> {
//   key: keyof T;
//   title: string;
//   sortable?: boolean;
//   render?: (value: unknown, item: T) => React.ReactNode;
// }

// export interface PaginationProps {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
//   itemsPerPage: number;
//   totalItems: number;
// }
