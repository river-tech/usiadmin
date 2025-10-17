// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  joinDate: string;
  purchases: number;
  totalSpent: number;
  status: 'active' | 'inactive'; // Map to is_deleted: false = active, true = inactive
  is_banned?: boolean; // Map to is_deleted: true = banned, false = not banned
}

// Workflow types
export interface Workflow {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  sales: number;
  revenue: number;
  created: string;
  updated: string;
  status: 'active' | 'expired'; // Use database enum values
  categories: string[]; // Map to categories array
  jsonData?: string; // Map to flow jsonb
  timeToSetup?: number; // Map to time_to_setup
  videoDemo?: string; // Map to video_demo
  // previewImage sẽ được lấy từ workflow_assets table với kind = 'image'
}

// Purchase types
export interface Purchase {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  workflowId: string;
  workflowTitle: string;
  amount: number;
  date: string;
  paymentMethod: 'QR'; // Use database enum value
  status: 'ACTIVE' | 'PENDING' | 'REJECT'; // Use database enum values
  transactionId: string; // Map to transfer_code
}

// Activity/Log types
export interface Activity {
  id: string;
  admin: string;
  action: string;
  target: string;
  timestamp: string;
  details?: string;
}

// Analytics types
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

// Settings types
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

// UI Component types
export interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  description?: string;
}

export interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'ACTIVE' | 'PENDING' | 'REJECT' | 'expired';
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

// Navigation types
export interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  children?: NavItem[];
}

// Form types
export interface WorkflowFormData {
  title: string;
  description: string;
  category: string;
  price: number;
  categories: string[];
  previewImage?: File;
  jsonData?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  status: 'active' | 'inactive'; // Map to is_deleted
}

// Filter types
export interface FilterOptions {
  search: string;
  status?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  category?: string;
}

// Table types
export interface TableColumn<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}
