// ===========================================
// DATABASE QUERIES - UsITech Admin Portal
// ===========================================

import { SearchFilters } from './models';

// ===========================================
// USER QUERIES
// ===========================================

export const UserQueries = {
  // Get all users with statistics
  getAllUsersWithStats: `
    SELECT 
      u.id,
      u.name,
      u.avatar_url,
      u.email,
      u.role,
      u.is_deleted,
      u.created_at,
      COUNT(p.id) as purchases_count,
      COALESCE(SUM(CASE WHEN p.status = 'ACTIVE' THEN p.amount ELSE 0 END), 0) as total_spent,
      u.is_deleted as is_banned
    FROM users u
    LEFT JOIN purchases p ON u.id = p.user_id
    GROUP BY u.id, u.name, u.avatar_url, u.email, u.role, u.is_deleted, u.created_at
    ORDER BY u.created_at DESC
  `,

  // Get user by ID with stats
  getUserByIdWithStats: `
    SELECT 
      u.id,
      u.name,
      u.avatar_url,
      u.email,
      u.role,
      u.is_deleted,
      u.created_at,
      COUNT(p.id) as purchases_count,
      COALESCE(SUM(CASE WHEN p.status = 'ACTIVE' THEN p.amount ELSE 0 END), 0) as total_spent,
      u.is_deleted as is_banned
    FROM users u
    LEFT JOIN purchases p ON u.id = p.user_id
    WHERE u.id = $1
    GROUP BY u.id, u.name, u.avatar_url, u.email, u.role, u.is_deleted, u.created_at
  `,

  // Search users
  searchUsers: (filters: SearchFilters) => `
    SELECT 
      u.id,
      u.name,
      u.avatar_url,
      u.email,
      u.role,
      u.is_deleted,
      u.created_at,
      COUNT(p.id) as purchases_count,
      COALESCE(SUM(CASE WHEN p.status = 'ACTIVE' THEN p.amount ELSE 0 END), 0) as total_spent,
      u.is_deleted as is_banned
    FROM users u
    LEFT JOIN purchases p ON u.id = p.user_id
    WHERE 1=1
    ${filters.search ? `AND (u.name ILIKE '%${filters.search}%' OR u.email ILIKE '%${filters.search}%')` : ''}
    ${filters.role ? `AND u.role = '${filters.role}'` : ''}
    ${filters.status ? `AND u.is_deleted = ${filters.status === 'inactive'}` : ''}
    GROUP BY u.id, u.name, u.avatar_url, u.email, u.role, u.is_deleted, u.created_at
    ORDER BY u.created_at DESC
  `,

  // Get user statistics
  getUserStats: `
    SELECT 
      COUNT(*) as total_users,
      COUNT(CASE WHEN is_deleted = false THEN 1 END) as active_users,
      COUNT(CASE WHEN is_deleted = true THEN 1 END) as banned_users,
      COUNT(CASE WHEN created_at >= CURRENT_DATE THEN 1 END) as new_users_today,
      COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as new_users_this_week,
      COUNT(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 END) as new_users_this_month
    FROM users
  `,

  // Ban/Unban user
  banUser: `UPDATE users SET is_deleted = true WHERE id = $1`,
  unbanUser: `UPDATE users SET is_deleted = false WHERE id = $1`,

  // Delete user (soft delete)
  deleteUser: `UPDATE users SET is_deleted = true WHERE id = $1`,

  // Create user
  createUser: `
    INSERT INTO users (id, name, avatar_url, email, password_hash, role, is_deleted, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `,

  // Update user
  updateUser: `
    UPDATE users 
    SET name = $2, avatar_url = $3, email = $4, role = $5, is_deleted = $6
    WHERE id = $1
  `
};

// ===========================================
// WORKFLOW QUERIES
// ===========================================

export const WorkflowQueries = {
  // Get all workflows with statistics
  getAllWorkflowsWithStats: `
    SELECT 
      w.id,
      w.title,
      w.description,
      w.price,
      w.status,
      w.categories,
      w.downloads_count,
      w.time_to_setup,
      w.video_demo,
      w.flow,
      w.rating_avg,
      w.created_at,
      w.updated_at,
      COUNT(p.id) as sales_count,
      COALESCE(SUM(CASE WHEN p.status = 'ACTIVE' THEN p.amount ELSE 0 END), 0) as revenue,
      (
        SELECT wa.asset_url 
        FROM workflow_assets wa 
        WHERE wa.workflow_id = w.id AND wa.kind = 'image' 
        LIMIT 1
      ) as preview_image
    FROM workflows w
    LEFT JOIN purchases p ON w.id = p.workflow_id
    GROUP BY w.id, w.title, w.description, w.price, w.status, w.categories, 
             w.downloads_count, w.time_to_setup, w.video_demo, w.flow, 
             w.rating_avg, w.created_at, w.updated_at
    ORDER BY w.created_at DESC
  `,

  // Get workflow by ID with stats
  getWorkflowByIdWithStats: `
    SELECT 
      w.id,
      w.title,
      w.description,
      w.price,
      w.status,
      w.categories,
      w.downloads_count,
      w.time_to_setup,
      w.video_demo,
      w.flow,
      w.rating_avg,
      w.created_at,
      w.updated_at,
      COUNT(p.id) as sales_count,
      COALESCE(SUM(CASE WHEN p.status = 'ACTIVE' THEN p.amount ELSE 0 END), 0) as revenue,
      (
        SELECT wa.asset_url 
        FROM workflow_assets wa 
        WHERE wa.workflow_id = w.id AND wa.kind = 'image' 
        LIMIT 1
      ) as preview_image
    FROM workflows w
    LEFT JOIN purchases p ON w.id = p.workflow_id
    WHERE w.id = $1
    GROUP BY w.id, w.title, w.description, w.price, w.status, w.categories, 
             w.downloads_count, w.time_to_setup, w.video_demo, w.flow, 
             w.rating_avg, w.created_at, w.updated_at
  `,

  // Get workflow categories
  getWorkflowCategories: `
    SELECT c.id, c.name, c.image_url, c.created_at
    FROM categories c
    INNER JOIN workflow_categories wc ON c.id = wc.category_id
    WHERE wc.workflow_id = $1
  `,

  // Get workflow assets
  getWorkflowAssets: `
    SELECT id, workflow_id, asset_url, kind, created_at
    FROM workflow_assets
    WHERE workflow_id = $1
    ORDER BY kind, created_at
  `,

  // Search workflows
  searchWorkflows: (filters: SearchFilters) => `
    SELECT 
      w.id,
      w.title,
      w.description,
      w.price,
      w.status,
      w.categories,
      w.downloads_count,
      w.time_to_setup,
      w.video_demo,
      w.flow,
      w.rating_avg,
      w.created_at,
      w.updated_at,
      COUNT(p.id) as sales_count,
      COALESCE(SUM(CASE WHEN p.status = 'ACTIVE' THEN p.amount ELSE 0 END), 0) as revenue
    FROM workflows w
    LEFT JOIN purchases p ON w.id = p.workflow_id
    LEFT JOIN workflow_categories wc ON w.id = wc.workflow_id
    LEFT JOIN categories c ON wc.category_id = c.id
    WHERE 1=1
    ${filters.search ? `AND (w.title ILIKE '%${filters.search}%' OR w.description ILIKE '%${filters.search}%')` : ''}
    ${filters.status ? `AND w.status = '${filters.status}'` : ''}
    ${filters.category ? `AND c.name = '${filters.category}'` : ''}
    GROUP BY w.id, w.title, w.description, w.price, w.status, w.categories, 
             w.downloads_count, w.time_to_setup, w.video_demo, w.flow, 
             w.rating_avg, w.created_at, w.updated_at
    ORDER BY w.created_at DESC
  `,

  // Get workflow statistics
  getWorkflowStats: `
    SELECT 
      COUNT(*) as total_workflows,
      COUNT(CASE WHEN status = 'active' THEN 1 END) as active_workflows,
      COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired_workflows,
      SUM(downloads_count) as total_downloads,
      COALESCE(SUM(p.amount), 0) as total_revenue
    FROM workflows w
    LEFT JOIN purchases p ON w.id = p.workflow_id AND p.status = 'ACTIVE'
  `,

  // Create workflow
  createWorkflow: `
    INSERT INTO workflows (id, title, description, price, status, features, 
                          downloads_count, time_to_setup, video_demo, flow, 
                          rating_avg, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
  `,

  // Update workflow
  updateWorkflow: `
    UPDATE workflows 
    SET title = $2, description = $3, price = $4, status = $5, features = $6,
        time_to_setup = $7, video_demo = $8, flow = $9, updated_at = $10
    WHERE id = $1
  `,

  // Delete workflow
  deleteWorkflow: `DELETE FROM workflows WHERE id = $1`,

  // Add workflow asset
  addWorkflowAsset: `
    INSERT INTO workflow_assets (id, workflow_id, asset_url, kind, created_at)
    VALUES ($1, $2, $3, $4, $5)
  `,

  // Remove workflow asset
  removeWorkflowAsset: `DELETE FROM workflow_assets WHERE id = $1`
};

// ===========================================
// PURCHASE QUERIES
// ===========================================

export const PurchaseQueries = {
  // Get all purchases with details
  getAllPurchasesWithDetails: `
    SELECT 
      p.id,
      p.user_id,
      p.workflow_id,
      p.bank_account,
      p.bank_name,
      p.transfer_code,
      p.amount,
      p.status,
      p.payment_method,
      p.paid_at,
      p.created_at,
      p.updated_at,
      u.name as user_name,
      u.email as user_email,
      w.title as workflow_title,
      w.description as workflow_description
    FROM purchases p
    JOIN users u ON p.user_id = u.id
    JOIN workflows w ON p.workflow_id = w.id
    ORDER BY p.created_at DESC
  `,

  // Get purchase by ID with details
  getPurchaseByIdWithDetails: `
    SELECT 
      p.id,
      p.user_id,
      p.workflow_id,
      p.bank_account,
      p.bank_name,
      p.transfer_code,
      p.amount,
      p.status,
      p.payment_method,
      p.paid_at,
      p.created_at,
      p.updated_at,
      u.name as user_name,
      u.email as user_email,
      w.title as workflow_title,
      w.description as workflow_description
    FROM purchases p
    JOIN users u ON p.user_id = u.id
    JOIN workflows w ON p.workflow_id = w.id
    WHERE p.id = $1
  `,

  // Search purchases
  searchPurchases: (filters: SearchFilters) => `
    SELECT 
      p.id,
      p.user_id,
      p.workflow_id,
      p.bank_account,
      p.bank_name,
      p.transfer_code,
      p.amount,
      p.status,
      p.payment_method,
      p.paid_at,
      p.created_at,
      p.updated_at,
      u.name as user_name,
      u.email as user_email,
      w.title as workflow_title,
      w.description as workflow_description
    FROM purchases p
    JOIN users u ON p.user_id = u.id
    JOIN workflows w ON p.workflow_id = w.id
    WHERE 1=1
    ${filters.search ? `AND (u.name ILIKE '%${filters.search}%' OR w.title ILIKE '%${filters.search}%' OR p.transfer_code ILIKE '%${filters.search}%')` : ''}
    ${filters.status ? `AND p.status = '${filters.status}'` : ''}
    ${filters.date_from ? `AND p.created_at >= '${filters.date_from}'` : ''}
    ${filters.date_to ? `AND p.created_at <= '${filters.date_to}'` : ''}
    ORDER BY p.created_at DESC
  `,

  // Get purchase statistics
  getPurchaseStats: `
    SELECT 
      COUNT(*) as total_purchases,
      COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active_purchases,
      COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending_purchases,
      COUNT(CASE WHEN status = 'REJECT' THEN 1 END) as rejected_purchases,
      COALESCE(SUM(CASE WHEN status = 'ACTIVE' THEN amount ELSE 0 END), 0) as total_revenue,
      COALESCE(SUM(CASE WHEN status = 'ACTIVE' AND created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN amount ELSE 0 END), 0) as revenue_this_month
    FROM purchases
  `,

  // Update purchase status
  updatePurchaseStatus: `
    UPDATE purchases 
    SET status = $2, updated_at = $3
    WHERE id = $1
  `,

  // Create purchase
  createPurchase: `
    INSERT INTO purchases (id, user_id, workflow_id, bank_account, bank_name, 
                          transfer_code, amount, status, payment_method, 
                          paid_at, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
  `
};

// ===========================================
// NOTIFICATION QUERIES
// ===========================================

export const NotificationQueries = {
  // Get all notifications with user details
  getAllNotificationsWithUser: `
    SELECT 
      n.id,
      n.user_id,
      n.title,
      n.message,
      n.type,
      n.is_unread,
      n.created_at,
      u.name as user_name,
      u.email as user_email
    FROM notifications n
    JOIN users u ON n.user_id = u.id
    ORDER BY n.created_at DESC
  `,

  // Get notification by ID with user details
  getNotificationByIdWithUser: `
    SELECT 
      n.id,
      n.user_id,
      n.title,
      n.message,
      n.type,
      n.is_unread,
      n.created_at,
      u.name as user_name,
      u.email as user_email
    FROM notifications n
    JOIN users u ON n.user_id = u.id
    WHERE n.id = $1
  `,

  // Get unread notifications count
  getUnreadNotificationsCount: `
    SELECT COUNT(*) as unread_count
    FROM notifications
    WHERE is_unread = true
  `,

  // Get notification statistics
  getNotificationStats: `
    SELECT 
      COUNT(*) as total_notifications,
      COUNT(CASE WHEN is_unread = true THEN 1 END) as unread_notifications,
      COUNT(CASE WHEN type = 'SUCCESS' THEN 1 END) as success_notifications,
      COUNT(CASE WHEN type = 'WARNING' THEN 1 END) as warning_notifications,
      COUNT(CASE WHEN type = 'ERROR' THEN 1 END) as error_notifications
    FROM notifications
  `,

  // Mark notification as read
  markNotificationAsRead: `
    UPDATE notifications 
    SET is_unread = false 
    WHERE id = $1
  `,

  // Mark all notifications as read
  markAllNotificationsAsRead: `
    UPDATE notifications 
    SET is_unread = false
  `,

  // Create notification
  createNotification: `
    INSERT INTO notifications (id, user_id, title, message, type, is_unread, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `,

  // Delete notification
  deleteNotification: `DELETE FROM notifications WHERE id = $1`
};

// ===========================================
// CATEGORY QUERIES
// ===========================================

export const CategoryQueries = {
  // Get all categories
  getAllCategories: `
    SELECT id, name, image_url, created_at
    FROM categories
    ORDER BY name
  `,

  // Get category by ID
  getCategoryById: `
    SELECT id, name, image_url, created_at
    FROM categories
    WHERE id = $1
  `,

  // Create category
  createCategory: `
    INSERT INTO categories (id, name, image_url, created_at)
    VALUES ($1, $2, $3, $4)
  `,

  // Update category
  updateCategory: `
    UPDATE categories 
    SET name = $2, image_url = $3
    WHERE id = $1
  `,

  // Delete category
  deleteCategory: `DELETE FROM categories WHERE id = $1`,

  // Link workflow to category
  linkWorkflowToCategory: `
    INSERT INTO workflow_categories (id, workflow_id, category_id, created_at)
    VALUES ($1, $2, $3, $4)
  `,

  // Unlink workflow from category
  unlinkWorkflowFromCategory: `
    DELETE FROM workflow_categories 
    WHERE workflow_id = $1 AND category_id = $2
  `
};

// ===========================================
// CONTACT MESSAGE QUERIES
// ===========================================

export const ContactMessageQueries = {
  // Get all contact messages
  getAllContactMessages: `
    SELECT id, full_name, email, subject, message, is_resolved, created_at
    FROM contact_messages
    ORDER BY created_at DESC
  `,

  // Get contact message by ID
  getContactMessageById: `
    SELECT id, full_name, email, subject, message, is_resolved, created_at
    FROM contact_messages
    WHERE id = $1
  `,

  // Get unresolved contact messages
  getUnresolvedContactMessages: `
    SELECT id, full_name, email, subject, message, is_resolved, created_at
    FROM contact_messages
    WHERE is_resolved = false
    ORDER BY created_at DESC
  `,

  // Mark contact message as resolved
  markContactMessageAsResolved: `
    UPDATE contact_messages 
    SET is_resolved = true 
    WHERE id = $1
  `,

  // Create contact message
  createContactMessage: `
    INSERT INTO contact_messages (id, full_name, email, subject, message, is_resolved, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `,

  // Delete contact message
  deleteContactMessage: `DELETE FROM contact_messages WHERE id = $1`
};

// ===========================================
// EXPORT ALL QUERIES
// ===========================================

export const DatabaseQueries = {
  UserQueries,
  WorkflowQueries,
  PurchaseQueries,
  NotificationQueries,
  CategoryQueries,
  ContactMessageQueries
} as const;
