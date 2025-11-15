// ===========================================
// DATABASE MODELS - UsITech Admin Portal
// ===========================================

// ===========================================
// ENUMS
// ===========================================

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum WorkflowStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired'
}

export enum PurchaseStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  REJECT = 'REJECT'
}

export enum PaymentMethod {
  QR = 'QR'
}

export enum NotificationType {
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

export enum AssetKind {
  IMAGE = 'image',
  VIDEO = 'video',
  ZIP = 'zip',
  DOC = 'doc'
}

// ===========================================
// USER MANAGEMENT MODELS
// ===========================================

export interface User {
  id: string;                    // uuid [pk]
  name: string;                  // varchar(120)
  avatar_url: string;            // string
  email: string;                 // varchar(150) [unique]
  password_hash: string;         // text
  role: UserRole;               // user_role [default: 'USER']
  is_deleted: boolean;          // boolean [default: false]
  created_at: string;           // timestamptz [default: `now()`]
}

export interface Notification {
  id: string;                   // uuid [pk]
  user_id: string;              // uuid [ref: > users.id]
  title: string;                // varchar(200)
  message: string;              // text
  type: NotificationType;       // Enoti
  is_unread: boolean;          // boolean [default: true]
  created_at: string;           // timestamptz [default: `now()`]
}

export interface ContactMessage {
  id: string;                   // uuid [pk]
  full_name: string;            // varchar(160) - tên người gửi
  email: string;                // varchar(150) - email người gửi
  subject?: string;             // varchar(200) - tiêu đề (optional)
  message: string;              // text - nội dung tin nhắn
  is_resolved: boolean;         // boolean [default: false] - đã xử lý hay chưa
  created_at: string;           // timestamptz [default: `now()`]
}

// ===========================================
// WORKFLOW MARKETPLACE MODELS
// ===========================================

export interface Workflow {
  id: string;                   // uuid [pk]
  title: string;                // varchar(200)
  description: string;          // text
  price: number;                // numeric(12,2)
  status: WorkflowStatus;       // workflow_status [default: 'active']
  categories: string[];         // text[] - key categories list
  downloads_count: number;      // bigint [default: 0]
  time_to_setup: number;        // int
  video_demo: string;           // string
  flow: Record<string, unknown>;    // jsonb - full JSON definition of the workflow
  rating_avg: number;           // numeric(3,2)
  created_at: string;           // timestamptz [default: `now()`]
  updated_at: string;           // timestamptz [default: `now()`]
}

export interface Category {
  id: string;                   // uuid [pk]
  name: string;                 // varchar(100) [unique]
  image_url: string;            // string
  created_at: string;           // timestamptz [default: `now()`]
}

export interface WorkflowCategory {
  id: string;                   // uuid [pk]
  workflow_id: string;          // uuid [ref: > workflows.id]
  category_id: string;          // uuid [ref: > categories.id]
  created_at: string;           // timestamptz [default: `now()`]
}

export interface WorkflowAsset {
  id: string;                   // uuid [pk]
  workflow_id: string;          // uuid [ref: > workflows.id]
  asset_url: string;            // text
  kind: AssetKind;              // varchar(30) [default: 'image'] - image, video, zip, doc...
  created_at: string;           // timestamptz [default: `now()`]
}

export interface Favorite {
  id: string;                   // uuid [pk]
  user_id: string;              // uuid [ref: > users.id]
  workflow_id: string;          // uuid [ref: > workflows.id]
  created_at: string;           // timestamptz [default: `now()`]
}

export interface Comment {
  id: string;                   // uuid [pk]
  workflow_id: string;          // uuid [ref: > workflows.id]
  user_id: string;              // uuid [ref: > users.id]
  rating: number;               // int [default: 5]
  parent_comment_id?: string;   // uuid [ref: > comments.id]
  content: string;              // text
  likes_count: number;          // int [default: 0]
  created_at: string;           // timestamptz [default: `now()`]
}

// ===========================================
// PURCHASES & INVOICES MODELS
// ===========================================

export interface Purchase {
  id: string;                   // uuid [pk]
  user_id: string;              // uuid [ref: > users.id] - ai mua
  workflow_id: string;          // uuid [ref: > workflows.id] - mua workflow nào
  bank_account: string;          // VARCHAR(50)
  bank_name: string;            // string
  transfer_code: string;        // string
  amount: number;               // numeric(12,2) - giá gốc (VNĐ)
  status: PurchaseStatus;       // purchase_status [default: 'PENDING'] - PENDING | ACTIVE | REJECT
  payment_method: PaymentMethod; // payment_method [default: 'QR'] - hiện tại chỉ QR
  paid_at?: string;             // timestamptz - thời điểm thanh toán (nếu có)
  created_at: string;           // timestamptz [default: `now()`]
  updated_at: string;           // timestamptz [default: `now()`]
}

export interface Invoice {
  id: string;                   // uuid [pk]
  purchase_id: string;          // uuid [ref: > purchases.id, unique] - giao dịch tương ứng
  invoice_number: string;       // varchar(40) [unique] - mã hóa đơn (tự sinh)
  billing_name: string;         // varchar(160) - tên người mua
  billing_email: string;        // varchar(150) - email nhận bill
  amount: number;               // numeric(12,2) - số tiền thanh toán (VNĐ)
  issued_at: string;            // timestamptz [default: `now()`] - thời gian xuất bill
  created_at: string;           // timestamptz [default: `now()`]
}

// ===========================================
// EXTENDED MODELS (WITH JOINS)
// ===========================================

export interface UserWithStats extends User {
  purchases_count: number;      // COUNT(purchases.id)
  total_spent: number;          // SUM(purchases.amount)
  is_banned: boolean;           // derived from is_deleted
}

export interface WorkflowWithStats extends Omit<Workflow, 'categories'> {
  sales_count: number;          // COUNT(purchases.id)
  revenue: number;              // SUM(purchases.amount)
  preview_image?: string;       // FROM workflow_assets WHERE kind = 'image'
  categories: Category[];       // JOIN workflow_categories + categories
}

export interface PurchaseWithDetails extends Purchase {
  user_name: string;            // FROM users.name
  user_email: string;           // FROM users.email
  workflow_title: string;       // FROM workflows.title
  workflow_description: string; // FROM workflows.description
}

export interface NotificationWithUser extends Notification {
  user_name: string;            // FROM users.name
  user_email: string;           // FROM users.email
}

// ===========================================
// ADMIN INTERFACE MODELS
// ================================

export interface UserStats {
  total_users: number;
  active_users: number;
  banned_users: number;
  new_users_today: number;
  new_users_this_week: number;
  new_users_this_month: number;
}

export interface WorkflowStats {
  total_workflows: number;
  active_workflows: number;
  expired_workflows: number;
  total_downloads: number;
  total_revenue: number;
}

export interface PurchaseStats {
  total_purchases: number;
  active_purchases: number;
  pending_purchases: number;
  rejected_purchases: number;
  total_revenue: number;
  revenue_this_month: number;
}

export interface NotificationStats {
  total_notifications: number;
  unread_notifications: number;
  success_notifications: number;
  warning_notifications: number;
  error_notifications: number;
}

// ===========================================
// FORM MODELS
// ===========================================

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar_url?: string;
}

export interface WorkflowFormData {
  title: string;
  description: string;
  price: number;
  categories: string[];
  time_to_setup: number;
  video_demo: string;
  flow: Record<string, unknown>;
  category_ids: string[];
}

export interface PurchaseFormData {
  user_id: string;
  workflow_id: string;
  bank_account: string;
  bank_name: string;
  transfer_code: string;
  amount: number;
  payment_method: PaymentMethod;
}

export interface NotificationFormData {
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
}

// ===========================================
// API RESPONSE MODELS
// ===========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface SearchFilters {
  search?: string;
  status?: string;
  role?: UserRole;
  category?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// ===========================================
// UTILITY TYPES
// ===========================================

export type CreateUserData = Omit<User, 'id' | 'created_at'>;
export type UpdateUserData = Partial<Omit<User, 'id' | 'created_at'>>;

export type CreateWorkflowData = Omit<Workflow, 'id' | 'created_at' | 'updated_at'>;
export type UpdateWorkflowData = Partial<Omit<Workflow, 'id' | 'created_at' | 'updated_at'>>;

export type CreatePurchaseData = Omit<Purchase, 'id' | 'created_at' | 'updated_at'>;
export type UpdatePurchaseData = Partial<Omit<Purchase, 'id' | 'created_at' | 'updated_at'>>;

export type CreateNotificationData = Omit<Notification, 'id' | 'created_at'>;
export type UpdateNotificationData = Partial<Omit<Notification, 'id' | 'created_at'>>;

// ===========================================
// DATABASE RELATIONSHIPS
// ===========================================

export interface DatabaseRelationships {
  // User relationships
  user_notifications: Notification[];
  user_purchases: Purchase[];
  user_favorites: Favorite[];
  user_comments: Comment[];
  
  // Workflow relationships
  workflow_categories: WorkflowCategory[];
  workflow_assets: WorkflowAsset[];
  workflow_purchases: Purchase[];
  workflow_favorites: Favorite[];
  workflow_comments: Comment[];
  
  // Purchase relationships
  purchase_invoice?: Invoice;
  purchase_user: User;
  purchase_workflow: Workflow;
  
  // Category relationships
  category_workflows: WorkflowCategory[];
}

// ===========================================
// EXPORT ALL MODELS
// ===========================================

export const Models = {
  // Enums
  UserRole,
  WorkflowStatus,
  PurchaseStatus,
  PaymentMethod,
  NotificationType,
  AssetKind,
  
  // Core Models
  // Notification,
  // Comment,
  
  // Extended Models

  
} as const;
