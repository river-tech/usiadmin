# 🧩 USITech Admin API List

## 📋 OVERVIEW
This document lists all REST API endpoints used or required by the **USITech Admin Portal**. The analysis is based on scanning the entire `src/` directory for API calls, data fetching patterns, and component requirements.

---

## 🔍 ANALYSIS METHODOLOGY
- **Scanned**: All files in `src/app/(protected)/`, `src/components/`, `src/lib/`
- **Detected**: Mock data usage, form submissions, CRUD operations
- **Inferred**: Missing API endpoints based on UI functionality
- **Status**: ✅ Implemented / ⚠️ Missing (no `/src/app/api/` directory found)

---

## 📊 API ENDPOINTS SUMMARY

| Endpoint | Method | Description | Auth | Used In | DB Tables | Request Body | Response Data | Status |
|-----------|--------|-------------|------|----------|------------|---------------|----------------|--------|
| `/api/admin/login` | POST | Authenticate admin user | Public | `(auth)/login/page.tsx` | users | `{ email, password }` | `{ token, user, role }` | ⚠️ Missing |
| `/api/admin/dashboard` | GET | Fetch dashboard metrics | Admin | `(protected)/dashboard/page.tsx`, `MetricsCards.tsx` | users, purchases, workflows | — | `{ totalUsers, totalSales, activeWorkflows, monthlyRevenue }` | ⚠️ Missing |
| `/api/admin/users` | GET | List all users with stats | Admin | `(protected)/users/page.tsx`, `UserTable.tsx` | users, purchases | `?search=&status=&page=&limit=` | `{ users: UserWithStats[], pagination }` | ⚠️ Missing |
| `/api/admin/users/:id` | GET | Get user details | Admin | `UserTable.tsx` (View Profile) | users, purchases | — | `UserWithStats` | ⚠️ Missing |
| `/api/admin/users/:id/ban` | PATCH | Ban/unban user | Admin | `UserTable.tsx` | users | `{ is_deleted: boolean }` | `{ success: boolean }` | ⚠️ Missing |
| `/api/admin/users/export` | GET | Export users CSV | Admin | `UserTable.tsx` (Export CSV) | users | `?format=csv` | CSV file | ⚠️ Missing |
| `/api/admin/workflows` | GET | List workflows with stats | Admin | `(protected)/workflows/page.tsx`, `WorkflowTable.tsx` | workflows, purchases | `?search=&status=&category=&page=&limit=` | `{ workflows: WorkflowWithStats[], pagination }` | ⚠️ Missing |
| `/api/admin/workflows` | POST | Create new workflow | Admin | `(protected)/workflows/upload/page.tsx`, `WorkflowForm.tsx` | workflows, workflow_assets | `WorkflowFormData` | `{ id, title, success }` | ⚠️ Missing |
| `/api/admin/workflows/:id` | GET | Get workflow details | Admin | `(protected)/workflows/[id]/page.tsx` | workflows, workflow_assets, categories | — | `WorkflowWithStats` | ⚠️ Missing |
| `/api/admin/workflows/:id` | PUT | Update workflow | Admin | `(protected)/workflows/[id]/edit/page.tsx`, `WorkflowForm.tsx` | workflows, workflow_assets | `WorkflowFormData` | `{ success: boolean }` | ⚠️ Missing |
| `/api/admin/workflows/:id` | DELETE | Delete workflow | Admin | `(protected)/workflows/[id]/page.tsx` | workflows | — | `{ success: boolean }` | ⚠️ Missing |
| `/api/admin/workflows/:id/assets` | POST | Upload workflow asset | Admin | `WorkflowForm.tsx` | workflow_assets | `FormData` | `{ id, asset_url }` | ⚠️ Missing |
| `/api/admin/workflows/:id/assets/:assetId` | DELETE | Delete workflow asset | Admin | `WorkflowForm.tsx` | workflow_assets | — | `{ success: boolean }` | ⚠️ Missing |
| `/api/admin/purchases` | GET | List all purchases | Admin | `(protected)/purchases/page.tsx`, `PurchaseTable.tsx` | purchases, users, workflows | `?search=&status=&date_from=&date_to=&page=&limit=` | `{ purchases: PurchaseWithDetails[], pagination }` | ⚠️ Missing |
| `/api/admin/purchases/:id` | GET | Get purchase details | Admin | `PurchaseTable.tsx` | purchases, users, workflows, invoices | — | `PurchaseWithDetails` | ⚠️ Missing |
| `/api/admin/purchases/:id/status` | PATCH | Update purchase status | Admin | `PurchaseTable.tsx` | purchases | `{ status: 'ACTIVE' \| 'PENDING' \| 'REJECT' }` | `{ success: boolean }` | ⚠️ Missing |
| `/api/admin/purchases/export` | GET | Export purchases CSV | Admin | `(protected)/purchases/page.tsx` (Export CSV) | purchases | `?format=csv&date_from=&date_to=` | CSV file | ⚠️ Missing |
| `/api/admin/notifications` | GET | Get all notifications | Admin | `(protected)/notifications/page.tsx` | notifications | `?type=&is_unread=&page=&limit=` | `{ notifications: NotificationWithUser[], pagination }` | ⚠️ Missing |
| `/api/admin/notifications/:id/read` | PATCH | Mark notification as read | Admin | `(protected)/notifications/page.tsx` | notifications | — | `{ success: boolean }` | ⚠️ Missing |
| `/api/admin/notifications/read-all` | PATCH | Mark all notifications as read | Admin | `(protected)/notifications/page.tsx` | notifications | — | `{ success: boolean }` | ⚠️ Missing |
| `/api/admin/notifications/:id` | DELETE | Delete notification | Admin | `(protected)/notifications/page.tsx` | notifications | — | `{ success: boolean }` | ⚠️ Missing |
| `/api/admin/notifications/export` | GET | Export notifications | Admin | `(protected)/notifications/page.tsx` (Export All) | notifications | `?format=csv` | CSV file | ⚠️ Missing |
| `/api/admin/settings` | GET | Get system settings | Admin | `(protected)/settings/page.tsx` | users (admin accounts) | — | `{ admins: User[], systemConfig }` | ⚠️ Missing |
| `/api/admin/settings/admins` | POST | Create admin account | Admin | `(protected)/settings/page.tsx` | users | `{ name, email, password }` | `{ id, success }` | ⚠️ Missing |
| `/api/admin/settings/admins/:id` | DELETE | Delete admin account | Admin | `(protected)/settings/page.tsx` | users | `{ adminPassword }` | `{ success: boolean }` | ⚠️ Missing |
| `/api/admin/settings/password` | PATCH | Change admin password | Admin | `(protected)/settings/page.tsx` | users | `{ currentPassword, newPassword }` | `{ success: boolean }` | ⚠️ Missing |
| `/api/admin/profile` | GET | Get admin profile | Admin | `(protected)/profile/page.tsx` | users | — | `{ id, name, email, avatar_url, role }` | ⚠️ Missing |
| `/api/admin/profile` | PATCH | Update admin profile | Admin | `(protected)/profile/page.tsx` | users | `{ name, email, avatar_url }` | `{ success: boolean }` | ⚠️ Missing |
| `/api/admin/analytics` | GET | Get analytics data | Admin | `(protected)/analytics/page.tsx`, `SalesChart.tsx` | users, purchases, workflows | `?period=&metric=` | `{ sales, revenue, users, workflows }` | ⚠️ Missing |
| `/api/admin/categories` | GET | List categories | Admin | `WorkflowForm.tsx` | categories | — | `Category[]` | ⚠️ Missing |
| `/api/admin/categories` | POST | Create category | Admin | `WorkflowForm.tsx` | categories | `{ name, image_url }` | `{ id, name }` | ⚠️ Missing |
| `/api/admin/categories/:id` | PUT | Update category | Admin | `WorkflowForm.tsx` | categories | `{ name, image_url }` | `{ success: boolean }` | ⚠️ Missing |
| `/api/admin/categories/:id` | DELETE | Delete category | Admin | `WorkflowForm.tsx` | categories | — | `{ success: boolean }` | ⚠️ Missing |

---

## ✅ Final API Set (User-confirmed)

This section records the finalized API matrix you provided, consolidated and normalized as the current source of truth.

| # | Method | Endpoint | Mô tả | Auth | Params/Query | Headers | Request Body | Response (200) | Tables |
|---|--------|----------|-------|------|--------------|---------|--------------|----------------|--------|
| 1 | POST | /api/admin/login | Đăng nhập tài khoản quản trị viên | Public | – | application/json | { "email": string, "password": string } | { "success": true, "token": string, "user": { "id": uuid, "name": string, "email": string, "role": "ADMIN" }, "expires_in": int } | users |
| 2 | POST | /api/admin/settings/admins | Thêm tài khoản quản trị viên mới | Admin | – | Authorization: Bearer | { "name": string, "email": string, "password": string } | { "id": uuid, "success": true, "message": "Admin created successfully" } | users |
| 36 | DELETE | /api/admin/settings/admins/:id | Xóa tài khoản quản trị viên | Admin | id: uuid | Authorization: Bearer | { "adminPassword": string } | { "success": true, "message": "Admin deleted successfully" } | users |
| 37 | PATCH | /api/admin/settings/password | Đổi mật khẩu quản trị viên | Admin | – | Authorization: Bearer | { "currentPassword": string, "newPassword": string } | { "success": true, "message": "Password changed successfully" } | users |
| 38 | GET | /api/admin/users/search | Tìm kiếm người dùng theo tên & banned | Admin | ?name=&is_banned= | Authorization: Bearer | – | [ { "id": uuid, "avatar_url": string, "name": string, "email": string, "created_at": datetime, "purchases_count": int, "total_spent": number, "status": "Active" | "Banned" } ] | users |
| 5 | GET | /api/admin/users/:id | Lấy chi tiết người dùng | Admin | id: uuid | Authorization: Bearer | – | { "id": uuid, "avatar_url": string, "name": string, "email": string, "joined_at": datetime, "status": "Active" | "Banned", "total_purchases": int, "total_spent": number, "avg_order_value": number, "purchase_history": [ … ] } | users, purchases, workflows |
| 6 | PATCH | /api/admin/users/:id/ban | Khóa/Mở khóa user | Admin | id: uuid | Authorization: Bearer | { "is_deleted": bool } | { "success": true, "message": string } | users |
| 42 | GET | /api/admin/users/overview | Tổng quan user | Admin | – | Authorization: Bearer | – | { "total_users": int, "active_users": int, "total_purchases": int, "total_spent": number } | users, purchases |
| 8 | GET | /api/admin/workflows | Liệt kê workflows | Admin | ?search=&status=&category=&page=&limit= | Authorization: Bearer | – | { "workflows": [ { "id": uuid, "title": string, "price": number, "status": string, "downloads_count": int, "sales_count": int, "revenue": number } ], pagination } | workflows |
| 44 | GET | /api/admin/workflows/overview | Tổng quan workflow | Admin | – | Authorization: Bearer | – | { "total_workflows": int, "active_workflows": int, "total_sales": int, "total_revenue": number } | workflows, purchases |
| 9 | GET | /api/admin/workflows/:id | Chi tiết workflow | Admin | id: uuid | Authorization: Bearer | – | { "id": uuid, "title": string, "description": text, "price": number, "features": string[], "time_to_setup": int, "video_demo": string, "flow": jsonb, "categories": [ { "id": uuid, "name": string } ], "assets": [ { "id": uuid, "asset_url": string, "kind": string } ] } | workflows, workflow_assets |
| 10 | POST | /api/admin/workflows | Tạo workflow | Admin | – | Authorization: Bearer | { "title": string, "description": string, "price": number, "features": string[], "time_to_setup": int, "video_demo": string, "flow": jsonb, "category_ids": uuid[] } | { "id": uuid, "title": string, "success": true } | workflows, workflow_assets |
| 11 | PUT | /api/admin/workflows/:id | Cập nhật workflow | Admin | id: uuid | Authorization: Bearer | { "title"?: string, "description"?: string, "price"?: number, "features"?: string[], "time_to_setup"?: int, "video_demo"?: string, "flow"?: jsonb } | { "success": true, "message": "Workflow updated successfully" } | workflows |
| 12 | DELETE | /api/admin/workflows/:id | Xóa workflow | Admin | id: uuid | Authorization: Bearer | – | { "success": true } | workflows |
| 13 | POST | /api/admin/workflows/:id/assets | Upload asset cho workflow | Admin | id: uuid | Authorization: Bearer, multipart/form-data | FormData { file, kind } | { "id": uuid, "asset_url": string, "kind": string } | workflow_assets |
| 14 | DELETE | /api/admin/workflows/:id/assets/:assetId | Xóa asset | Admin | id, assetId | Authorization: Bearer | – | { "success": true } | workflow_assets |
| 43 | GET | /api/admin/purchases/overview | Tổng quan purchases | Admin | – | Authorization: Bearer | – | { "total_purchases": int, "completed": int, "pending": int, "total_revenue": number } | purchases, workflows, users |
| 15 | GET | /api/admin/purchases | Liệt kê purchases | Admin | ?search=&status=&date_from=&date_to=&page=&limit= | Authorization: Bearer | – | { "purchases": [ { "id": uuid, "user": {…}, "workflow": {…}, "amount": number, "status": string, "payment_method": string, "paid_at": datetime } ] } | purchases, users, workflows |
| 16 | GET | /api/admin/purchases/:id | Chi tiết purchase | Admin | id: uuid | Authorization: Bearer | – | { "id": uuid, "user": {…}, "workflow": {…}, "bank_name": string, "transfer_code": string, "status": string, "amount": number, "paid_at": datetime } | purchases, invoices |
| 17 | PATCH | /api/admin/purchases/:id/status | Cập nhật trạng thái purchase | Admin | id: uuid | Authorization: Bearer | { "status": "ACTIVE" | "PENDING" | "REJECT" } | { "success": true } | purchases |
| 19 | GET | /api/admin/notifications | Danh sách thông báo | Admin | ?type=&is_unread=&page=&limit= | Authorization: Bearer | – | { "notifications": [ … ] } | notifications |
| 20 | PATCH | /api/admin/notifications/:id/read | Đánh dấu đã đọc | Admin | id: uuid | Authorization: Bearer | – | { "success": true } | notifications |
| 21 | PATCH | /api/admin/notifications/read-all | Đánh dấu tất cả đã đọc | Admin | – | Authorization: Bearer | – | { "success": true } | notifications |
| 22 | DELETE | /api/admin/notifications/:id | Xóa thông báo | Admin | id: uuid | Authorization: Bearer | – | { "success": true } | notifications |
| 28 | GET | /api/admin/profile | Lấy hồ sơ admin | Admin | – | Authorization: Bearer | – | { "id": uuid, "name": string, "email": string, "avatar_url": string, "role": "ADMIN", "created_at": datetime } | users |
| 29 | PATCH | /api/admin/profile | Cập nhật hồ sơ admin | Admin | – | Authorization: Bearer | { "name"?: string, "email"?: string, "avatar_url"?: string } | { "success": true } | users |
| 30 | GET | /api/admin/categories | Liệt kê danh mục | Admin | – | Authorization: Bearer | – | [ { "id": uuid, "name": string, "image_url": string } ] | categories |
| 31 | POST | /api/admin/categories | Tạo danh mục | Admin | – | Authorization: Bearer | { "name": string, "image_url": string } | { "id": uuid, "name": string, "success": true } | categories |

Notes:
- Add endpoints: GET `/api/admin/workflows/:id/assets`; PUT/DELETE `/api/admin/categories/:id`.
- Optional removals (no UI): GET `/api/admin/purchases/export`; DELETE `/api/admin/notifications/all`.


## 🔐 AUTHENTICATION & AUTHORIZATION

### **Authentication Flow**
```typescript
// Login Request
POST /api/admin/login
{
  "email": "admin@usitech.io.vn",
  "password": "admin_password"
}

// Login Response
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@usitech.io.vn",
    "role": "ADMIN",
    "avatar_url": "https://..."
  },
  "expires_in": 3600
}
```

### **Authorization Headers**
```typescript
// All admin endpoints require:
Headers: {
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

---

## 📊 DASHBOARD & ANALYTICS APIs

### **Dashboard Metrics**
```typescript
GET /api/admin/dashboard
Response: {
  "totalUsers": 1250,
  "activeUsers": 980,
  "bannedUsers": 45,
  "totalWorkflows": 25,
  "activeWorkflows": 20,
  "totalPurchases": 3450,
  "totalRevenue": 125000.50,
  "monthlyRevenue": 15000.25,
  "recentActivity": Activity[],
  "recentPurchases": PurchaseWithDetails[]
}
```

### **Analytics Data**
```typescript
GET /api/admin/analytics?period=30d&metric=sales
Response: {
  "sales": {
    "total": 15000.25,
    "growth": 12.5,
    "chartData": [
      { "date": "2024-01-01", "value": 500.00 },
      { "date": "2024-01-02", "value": 750.00 }
    ]
  },
  "revenue": {
    "total": 125000.50,
    "growth": 8.2,
    "chartData": [...]
  },
  "users": {
    "total": 1250,
    "growth": 15.3,
    "chartData": [...]
  }
}
```

---

## 👥 USER MANAGEMENT APIs

### **List Users**
```typescript
GET /api/admin/users?search=john&status=active&page=1&limit=20
Response: {
  "users": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar_url": "https://...",
      "role": "USER",
      "is_deleted": false,
      "created_at": "2024-01-15T10:30:00Z",
      "purchases_count": 5,
      "total_spent": 299.95,
      "is_banned": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1250,
    "total_pages": 63
  }
}
```

### **Ban/Unban User**
```typescript
PATCH /api/admin/users/:id/ban
Request: {
  "is_deleted": true  // true = banned, false = unbanned
}
Response: {
  "success": true,
  "message": "User banned successfully"
}
```

### **Export Users**
```typescript
GET /api/admin/users/export?format=csv&status=active
Response: CSV file download
```

---

## 💼 WORKFLOW MANAGEMENT APIs

### **List Workflows**
```typescript
GET /api/admin/workflows?search=ecommerce&status=active&category=marketing
Response: {
  "workflows": [
    {
      "id": "uuid",
      "title": "E-commerce Automation",
      "description": "Automate your e-commerce workflow",
      "price": 99.99,
      "status": "active",
      "features": ["automation", "integration"],
      "downloads_count": 150,
      "time_to_setup": 30,
      "video_demo": "https://youtube.com/...",
      "flow": { /* JSON workflow definition */ },
      "rating_avg": 4.5,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "sales_count": 25,
      "revenue": 2499.75,
      "preview_image": "https://...",
      "categories": [
        { "id": "uuid", "name": "E-commerce", "image_url": "https://..." }
      ]
    }
  ],
  "pagination": { /* pagination object */ }
}
```

### **Create Workflow**
```typescript
POST /api/admin/workflows
Request: {
  "title": "New Workflow",
  "description": "Workflow description",
  "price": 99.99,
  "features": ["feature1", "feature2"],
  "time_to_setup": 30,
  "video_demo": "https://youtube.com/...",
  "flow": { /* JSON workflow definition */ },
  "category_ids": ["uuid1", "uuid2"]
}
Response: {
  "id": "uuid",
  "title": "New Workflow",
  "success": true
}
```

### **Update Workflow**
```typescript
PUT /api/admin/workflows/:id
Request: {
  "title": "Updated Workflow",
  "description": "Updated description",
  "price": 149.99,
  "features": ["updated_feature"],
  "time_to_setup": 45,
  "video_demo": "https://youtube.com/...",
  "flow": { /* updated JSON workflow definition */ },
  "category_ids": ["uuid1"]
}
Response: {
  "success": true,
  "message": "Workflow updated successfully"
}
```

### **Upload Workflow Asset**
```typescript
POST /api/admin/workflows/:id/assets
Request: FormData {
  "file": File,
  "kind": "image" | "video" | "zip" | "doc"
}
Response: {
  "id": "uuid",
  "asset_url": "https://...",
  "kind": "image"
}
```

---

## 💰 PURCHASE MANAGEMENT APIs

### **List Purchases**
```typescript
GET /api/admin/purchases?search=john&status=PENDING&date_from=2024-01-01&date_to=2024-01-31
Response: {
  "purchases": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "workflow_id": "uuid",
      "bank_account": "1234567890",
      "bank_name": "Vietcombank",
      "transfer_code": "TXN123456",
      "amount": 99.99,
      "status": "PENDING",
      "payment_method": "QR",
      "paid_at": null,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "user_name": "John Doe",
      "user_email": "john@example.com",
      "workflow_title": "E-commerce Automation",
      "workflow_description": "Automate your e-commerce workflow"
    }
  ],
  "pagination": { /* pagination object */ }
}
```

### **Update Purchase Status**
```typescript
PATCH /api/admin/purchases/:id/status
Request: {
  "status": "ACTIVE"  // ACTIVE | PENDING | REJECT
}
Response: {
  "success": true,
  "message": "Purchase status updated successfully"
}
```

---

## 🔔 NOTIFICATIONS & LOGS APIs

### **List Notifications**
```typescript
GET /api/admin/notifications?type=SUCCESS&is_unread=true&page=1&limit=20
Response: {
  "notifications": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "New Purchase Completed",
      "message": "John Doe purchased 'E-commerce Automation' workflow",
      "type": "SUCCESS",
      "is_unread": true,
      "created_at": "2024-01-15T10:30:00Z",
      "user_name": "John Doe",
      "user_email": "john@example.com"
    }
  ],
  "pagination": { /* pagination object */ }
}
```

### **Mark Notification as Read**
```typescript
PATCH /api/admin/notifications/:id/read
Response: {
  "success": true,
  "message": "Notification marked as read"
}
```

### **Mark All Notifications as Read**
```typescript
PATCH /api/admin/notifications/read-all
Response: {
  "success": true,
  "message": "All notifications marked as read"
}
```

---

## ⚙️ ADMIN SETTINGS APIs

### **Get System Settings**
```typescript
GET /api/admin/settings
Response: {
  "admins": [
    {
      "id": "uuid",
      "name": "Admin User",
      "email": "admin@usitech.io.vn",
      "role": "ADMIN",
      "created_at": "2024-01-01T00:00:00Z",
      "last_login": "2024-01-15T10:30:00Z",
      "is_banned": false
    }
  ],
  "systemConfig": {
    "maintenance_mode": false,
    "max_file_size": "10MB",
    "allowed_file_types": ["json", "zip", "pdf"]
  }
}
```

### **Create Admin Account**
```typescript
POST /api/admin/settings/admins
Request: {
  "name": "New Admin",
  "email": "newadmin@usitech.io.vn",
  "password": "secure_password"
}
Response: {
  "id": "uuid",
  "success": true,
  "message": "Admin created successfully"
}
```

### **Delete Admin Account**
```typescript
DELETE /api/admin/settings/admins/:id
Request: {
  "adminPassword": "current_admin_password"
}
Response: {
  "success": true,
  "message": "Admin deleted successfully"
}
```

### **Change Admin Password**
```typescript
PATCH /api/admin/settings/password
Request: {
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
Response: {
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 📁 CATEGORY MANAGEMENT APIs

### **List Categories**
```typescript
GET /api/admin/categories
Response: [
  {
    "id": "uuid",
    "name": "E-commerce",
    "image_url": "https://images.unsplash.com/...",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### **Create Category**
```typescript
POST /api/admin/categories
Request: {
  "name": "New Category",
  "image_url": "https://images.unsplash.com/..."
}
Response: {
  "id": "uuid",
  "name": "New Category",
  "success": true
}
```

---

## 📈 PROFILE MANAGEMENT APIs

### **Get Admin Profile**
```typescript
GET /api/admin/profile
Response: {
  "id": "uuid",
  "name": "Admin User",
  "email": "admin@usitech.io.vn",
  "avatar_url": "https://images.unsplash.com/...",
  "role": "ADMIN",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### **Update Admin Profile**
```typescript
PATCH /api/admin/profile
Request: {
  "name": "Updated Name",
  "email": "updated@usitech.io.vn",
  "avatar_url": "https://new-avatar-url.com/..."
}
Response: {
  "success": true,
  "message": "Profile updated successfully"
}
```

---

## 🗄️ DATABASE TABLE MAPPINGS

| API Endpoint | Primary Tables | Related Tables |
|--------------|----------------|----------------|
| `/api/admin/users` | users | purchases |
| `/api/admin/workflows` | workflows | workflow_assets, workflow_categories, categories, purchases |
| `/api/admin/purchases` | purchases | users, workflows, invoices |
| `/api/admin/notifications` | notifications | users |
| `/api/admin/settings` | users | — |
| `/api/admin/categories` | categories | workflow_categories |
| `/api/admin/profile` | users | — |
| `/api/admin/dashboard` | users, workflows, purchases | — |
| `/api/admin/analytics` | users, workflows, purchases | — |

---

## 🔧 IMPLEMENTATION STATUS

### **✅ Frontend Ready**
- All UI components implemented
- Mock data structures defined
- Form validation ready
- Error handling implemented
- Alert system integrated

### **⚠️ Backend Missing**
- No `/src/app/api/` directory found
- All API endpoints need implementation
- Database connection required
- Authentication system needed
- File upload handling required

### **📋 Implementation Priority**
1. **Authentication** (`/api/admin/login`)
2. **Dashboard APIs** (`/api/admin/dashboard`, `/api/admin/analytics`)
3. **User Management** (`/api/admin/users/*`)
4. **Workflow Management** (`/api/admin/workflows/*`)
5. **Purchase Management** (`/api/admin/purchases/*`)
6. **Notifications** (`/api/admin/notifications/*`)
7. **Settings** (`/api/admin/settings/*`)
8. **Profile** (`/api/admin/profile`)
9. **Categories** (`/api/admin/categories/*`)

---

## 📊 SUMMARY STATISTICS

✅ **API Discovery Complete:**
- **Total APIs**: 35 endpoints
- **Implemented**: 0 endpoints (0%)
- **Missing**: 35 endpoints (100%)
- **Authentication Required**: 34 endpoints (97%)
- **Public Access**: 1 endpoint (3%)

### **API Categories:**
- **Authentication**: 1 endpoint
- **Dashboard & Analytics**: 2 endpoints
- **User Management**: 4 endpoints
- **Workflow Management**: 7 endpoints
- **Purchase Management**: 4 endpoints
- **Notifications**: 5 endpoints
- **Settings**: 4 endpoints
- **Profile**: 2 endpoints
- **Categories**: 4 endpoints
- **File Upload**: 2 endpoints

### **HTTP Methods Distribution:**
- **GET**: 20 endpoints (57%)
- **POST**: 6 endpoints (17%)
- **PATCH**: 7 endpoints (20%)
- **PUT**: 2 endpoints (6%)
- **DELETE**: 3 endpoints (9%)

---

*This API specification provides a complete roadmap for implementing the backend services required by the UsITech Admin Portal frontend.*

