# UsITech Admin Database Schema Audit Report

**Generated:** 2024-01-20T12:00:00Z  
**Auditor:** Principal Database Architect & Senior Full-Stack Auditor  
**Scope:** UsITech Admin Portal (admin.usitech.io.vn) - Next.js + TypeScript + Tailwind + shadcn/ui

## Executive Summary

**VERDICT: CHANGES_REQUIRED**

The current database schema has significant gaps that prevent full support of the Admin application features. While core entities (users, workflows, purchases) exist, critical admin-specific functionality requires additional tables, fields, and constraints.

## Traceability Matrix

| Admin Feature | Required Fields | DB Mapping | Match | Status |
|---------------|----------------|------------|-------|---------|
| `/login` | email, password_hash, role | users.email, users.password_hash, users.role | YES | ✅ OK |
| `/dashboard` | totalSales, totalRevenue, activeUsers, monthlyRevenue | Aggregated from purchases + users | PARTIAL | ⚠️ Missing aggregation |
| `/workflows/page.tsx` | title, category, price, sales, created, status | workflows.title, workflows.category, workflows.price, workflows.status | PARTIAL | ⚠️ Missing sales count |
| `/workflows/upload` | title, description, category, price, tags, jsonData | workflows.title, workflows.description, workflows.category, workflows.price, workflows.flow | PARTIAL | ⚠️ Missing tags field |
| `/workflows/[id]/edit` | Same as upload + status changes | Same as above | PARTIAL | ⚠️ Missing tags field |
| `/users/page.tsx` | name, email, joinDate, purchases, totalSpent, status, lastActive | users.name, users.email, users.created_at | PARTIAL | ⚠️ Missing computed fields |
| `/purchases/page.tsx` | userName, userEmail, workflowTitle, amount, date, paymentMethod, status, transactionId | purchases.* + users.name, users.email, workflows.title | PARTIAL | ⚠️ Missing transactionId |
| `/settings/storage` | maxFileSize, allowedTypes, storageProvider, awsConfig | **MISSING TABLE** | NO | ❌ Critical gap |
| `/settings/stripe` | publishableKey, secretKey, webhookSecret, enabled | **MISSING TABLE** | NO | ❌ Critical gap |
| `/settings/maintenance` | maintenanceMode, maintenanceMessage, allowedIPs | **MISSING TABLE** | NO | ❌ Critical gap |
| `/settings/notifications` | emailNotifications, slackWebhook, discordWebhook, adminEmails | **MISSING TABLE** | NO | ❌ Critical gap |
| `/logs/page.tsx` | admin, action, target, timestamp, details | **MISSING TABLE** | NO | ❌ Critical gap |
| `/analytics/page.tsx` | revenueChart, workflowCategories, topWorkflows | **MISSING MATERIALIZED VIEWS** | NO | ❌ Critical gap |

## Missing Components

### 1. System Settings Table
**Admin UI References:** `src/components/settings/*.tsx`
**Required Fields:**
- Storage: maxFileSize, allowedTypes, storageProvider, awsConfig
- Stripe: publishableKey, secretKey, webhookSecret, enabled
- Maintenance: maintenanceMode, maintenanceMessage, allowedIPs
- Notifications: emailNotifications, slackWebhook, discordWebhook, adminEmails

### 2. Admin Activity Logs Table
**Admin UI References:** `src/app/(protected)/logs/page.tsx`, `src/components/dashboard/RecentActivity.tsx`
**Required Fields:** admin, action, target, timestamp, details

### 3. Workflow Tags Field
**Admin UI References:** `src/components/workflows/WorkflowForm.tsx`
**Required:** Array field for workflow tags

### 4. Purchase Transaction ID
**Admin UI References:** `src/components/purchases/PurchaseTable.tsx`
**Required:** Unique transaction identifier for purchases

### 5. User Status Field
**Admin UI References:** `src/components/users/UserTable.tsx`
**Required:** Status enum (active, inactive, suspended)

### 6. User Avatar Field
**Admin UI References:** `src/components/users/UserTable.tsx`
**Required:** Avatar URL field

### 7. User Computed Fields
**Admin UI References:** `src/components/users/UserSummaryCard.tsx`
**Required:** Aggregated purchase count and total spent

## Extra Components (Not Used by Admin)

### Unused Tables
- `notifications` - Admin doesn't display user notifications
- `contact_messages` - Admin doesn't manage contact messages
- `categories` - Admin uses simple string categories, not separate table
- `workflow_categories` - Admin doesn't use many-to-many category relationships
- `workflow_assets` - Admin doesn't manage workflow assets
- `favorites` - Admin doesn't display user favorites
- `comments` - Admin doesn't manage workflow comments
- `invoices` - Admin doesn't display invoice details

## Misfit Issues

### 1. Enum Mismatches
- **Admin UI:** `'draft' | 'published' | 'unpublished'` (src/lib/types.ts:25)
- **DB Schema:** `'active' | 'expired'` 
- **Issue:** Complete mismatch in workflow status values

- **Admin UI:** `'completed' | 'pending' | 'failed' | 'refunded'` (src/lib/types.ts:42)
- **DB Schema:** `'ACTIVE' | 'PENDING' | 'REJECT'`
- **Issue:** Different status values and missing 'refunded'

- **Admin UI:** `'stripe' | 'paypal' | 'bank_transfer'` (src/lib/types.ts:41)
- **DB Schema:** `'QR'` only
- **Issue:** Payment method mismatch

### 2. Field Type Mismatches
- **Admin UI:** `purchases: number, totalSpent: number` (computed fields)
- **DB Schema:** No computed fields
- **Issue:** Admin expects aggregated user statistics

## Index & Constraints Recommendations

### Required Indexes for Admin Performance
```sql
-- User queries
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_email ON users(email);

-- Workflow queries  
CREATE INDEX idx_workflows_status ON workflows(status);
CREATE INDEX idx_workflows_created_at ON workflows(created_at DESC);
CREATE INDEX idx_workflows_category ON workflows(category);

-- Purchase queries
CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_purchases_created_at ON purchases(created_at DESC);
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_workflow_id ON purchases(workflow_id);

-- Composite indexes for admin datagrids
CREATE INDEX idx_purchases_user_created ON purchases(user_id, created_at DESC);
CREATE INDEX idx_workflows_status_created ON workflows(status, created_at DESC);
```

## Minimal Patch Plan (DDL)

### 1. Create System Settings Table
```sql
CREATE TABLE system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key varchar(120) UNIQUE NOT NULL,
  value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default settings
INSERT INTO system_settings (key, value) VALUES
('storage', '{"maxFileSize": 10, "allowedTypes": ["json", "txt", "csv"], "storageProvider": "aws"}'),
('stripe', '{"enabled": false, "publishableKey": "", "secretKey": "", "webhookSecret": ""}'),
('maintenance', '{"maintenanceMode": false, "maintenanceMessage": "", "allowedIPs": []}'),
('notifications', '{"emailNotifications": true, "slackWebhook": "", "discordWebhook": "", "adminEmails": []}');
```

### 2. Create Admin Activity Logs Table
```sql
CREATE TABLE admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES users(id),
  admin_name varchar(120) NOT NULL,
  action varchar(100) NOT NULL,
  target varchar(200) NOT NULL,
  details text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at DESC);
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
```

### 3. Add Missing Fields to Existing Tables
```sql
-- Add tags to workflows
ALTER TABLE workflows ADD COLUMN tags text[] DEFAULT '{}';

-- Add transaction_id to purchases  
ALTER TABLE purchases ADD COLUMN transaction_id varchar(100) UNIQUE;

-- Add status to users
ALTER TABLE users ADD COLUMN status varchar(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended'));

-- Add avatar to users
ALTER TABLE users ADD COLUMN avatar_url text;
```

### 4. Fix Enum Mismatches
```sql
-- Update workflow status enum
ALTER TABLE workflows DROP CONSTRAINT IF EXISTS workflows_status_check;
ALTER TABLE workflows ADD CONSTRAINT workflows_status_check CHECK (status IN ('draft', 'published', 'unpublished'));

-- Update purchase status enum  
ALTER TABLE purchases DROP CONSTRAINT IF EXISTS purchases_status_check;
ALTER TABLE purchases ADD CONSTRAINT purchases_status_check CHECK (status IN ('completed', 'pending', 'failed', 'refunded'));

-- Update payment method enum
ALTER TABLE purchases DROP CONSTRAINT IF EXISTS purchases_payment_method_check;
ALTER TABLE purchases ADD CONSTRAINT purchases_payment_method_check CHECK (payment_method IN ('stripe', 'paypal', 'bank_transfer'));
```

### 5. Create Materialized Views for Analytics
```sql
-- Daily revenue aggregation
CREATE MATERIALIZED VIEW daily_revenue AS
SELECT 
  DATE(created_at) as date,
  SUM(amount) as revenue,
  COUNT(*) as sales_count
FROM purchases 
WHERE status = 'completed'
GROUP BY DATE(created_at);

-- Workflow category revenue
CREATE MATERIALIZED VIEW workflow_category_revenue AS
SELECT 
  w.category,
  COUNT(*) as workflow_count,
  SUM(p.amount) as revenue
FROM workflows w
LEFT JOIN purchases p ON w.id = p.workflow_id AND p.status = 'completed'
GROUP BY w.category;

-- Top workflows by sales
CREATE MATERIALIZED VIEW top_workflows AS
SELECT 
  w.id,
  w.title,
  COUNT(p.id) as sales,
  SUM(p.amount) as revenue
FROM workflows w
LEFT JOIN purchases p ON w.id = p.workflow_id AND p.status = 'completed'
GROUP BY w.id, w.title
ORDER BY sales DESC;
```

## Migration Order & Backfill Notes

### Phase 1: Core Schema Updates
1. Create `system_settings` table
2. Create `admin_logs` table  
3. Add missing fields to existing tables
4. Update enum constraints

### Phase 2: Performance Optimization
1. Create required indexes
2. Create materialized views for analytics
3. Set up refresh schedules for materialized views

### Phase 3: Data Migration
1. Migrate existing workflow status values
2. Migrate existing purchase status values
3. Generate transaction IDs for existing purchases
4. Set default user statuses

### Backfill Considerations
- **Workflow Status:** Map 'active' → 'published', 'expired' → 'unpublished'
- **Purchase Status:** Map 'ACTIVE' → 'completed', 'PENDING' → 'pending', 'REJECT' → 'failed'
- **Transaction IDs:** Generate UUIDs for existing purchases
- **User Status:** Set all existing users to 'active'

## Security Considerations

### Admin Role Enforcement
- Current schema has `users.role` enum with 'ADMIN' value
- Admin routes should enforce `role = 'ADMIN'` check
- Consider adding IP allowlist for admin access (stored in system_settings)

### Data Protection
- System settings contain sensitive keys (Stripe, AWS)
- Ensure proper encryption at rest
- Implement audit logging for settings changes

## Final Verdict

**CHANGES_REQUIRED**

The database schema requires significant modifications to support the Admin application:

1. **Critical Missing Components:** System settings, admin logs, workflow tags, transaction IDs
2. **Enum Mismatches:** Workflow status, purchase status, payment methods
3. **Performance Issues:** Missing indexes for admin queries
4. **Analytics Gaps:** No materialized views for dashboard metrics

**Recommended Action:** Implement the Minimal Patch Plan in phases, starting with core schema updates, followed by performance optimization and data migration.

**Estimated Effort:** 2-3 days for schema changes, 1 day for data migration, 1 day for testing and validation.
