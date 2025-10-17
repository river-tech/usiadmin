-- ===========================================
-- DATABASE SCHEMA - UsITech Admin Portal
-- ===========================================

-- ===========================================
-- ENUMS
-- ===========================================

CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
CREATE TYPE workflow_status AS ENUM ('active', 'expired');
CREATE TYPE purchase_status AS ENUM ('ACTIVE', 'PENDING', 'REJECT');
CREATE TYPE payment_method AS ENUM ('QR');
CREATE TYPE enoti AS ENUM ('SUCCESS', 'WARNING', 'ERROR');
CREATE TYPE asset_kind AS ENUM ('image', 'video', 'zip', 'doc');

-- ===========================================
-- USER MANAGEMENT TABLES
-- ===========================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    avatar_url TEXT NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role DEFAULT 'USER',
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type enoti NOT NULL,
    is_unread BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(160) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- WORKFLOW MARKETPLACE TABLES
-- ===========================================

-- Workflows table
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    status workflow_status DEFAULT 'active',
    features TEXT[] NOT NULL DEFAULT '{}',
    downloads_count BIGINT DEFAULT 0,
    time_to_setup INTEGER NOT NULL,
    video_demo TEXT NOT NULL,
    flow JSONB NOT NULL,
    rating_avg NUMERIC(3,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow categories junction table
CREATE TABLE workflow_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workflow_id, category_id)
);

-- Workflow assets table
CREATE TABLE workflow_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    asset_url TEXT NOT NULL,
    kind asset_kind DEFAULT 'image',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites table
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, workflow_id)
);

-- Comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- PURCHASES & INVOICES TABLES
-- ===========================================

-- Purchases table
CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    bank_account VARCHAR(50) NOT NULL,
    bank_name TEXT NOT NULL,
    transfer_code TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    status purchase_status DEFAULT 'PENDING',
    payment_method payment_method DEFAULT 'QR',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_id UUID UNIQUE NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
    invoice_number VARCHAR(40) UNIQUE NOT NULL,
    billing_name VARCHAR(160) NOT NULL,
    billing_email VARCHAR(150) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- INDEXES
-- ===========================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_deleted ON users(is_deleted);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_unread ON notifications(is_unread);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Workflows indexes
CREATE INDEX idx_workflows_status ON workflows(status);
CREATE INDEX idx_workflows_price ON workflows(price);
CREATE INDEX idx_workflows_rating_avg ON workflows(rating_avg);
CREATE INDEX idx_workflows_created_at ON workflows(created_at);
CREATE INDEX idx_workflows_updated_at ON workflows(updated_at);

-- Workflow categories indexes
CREATE INDEX idx_workflow_categories_workflow_id ON workflow_categories(workflow_id);
CREATE INDEX idx_workflow_categories_category_id ON workflow_categories(category_id);

-- Workflow assets indexes
CREATE INDEX idx_workflow_assets_workflow_id ON workflow_assets(workflow_id);
CREATE INDEX idx_workflow_assets_kind ON workflow_assets(kind);

-- Favorites indexes
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_workflow_id ON favorites(workflow_id);

-- Comments indexes
CREATE INDEX idx_comments_workflow_id ON comments(workflow_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_comment_id ON comments(parent_comment_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- Purchases indexes
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_workflow_id ON purchases(workflow_id);
CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_purchases_payment_method ON purchases(payment_method);
CREATE INDEX idx_purchases_created_at ON purchases(created_at);
CREATE INDEX idx_purchases_updated_at ON purchases(updated_at);

-- Invoices indexes
CREATE INDEX idx_invoices_purchase_id ON invoices(purchase_id);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_issued_at ON invoices(issued_at);

-- Contact messages indexes
CREATE INDEX idx_contact_messages_is_resolved ON contact_messages(is_resolved);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);

-- ===========================================
-- TRIGGERS
-- ===========================================

-- Update updated_at timestamp for workflows
CREATE OR REPLACE FUNCTION update_workflow_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_workflow_updated_at
    BEFORE UPDATE ON workflows
    FOR EACH ROW
    EXECUTE FUNCTION update_workflow_updated_at();

-- Update updated_at timestamp for purchases
CREATE OR REPLACE FUNCTION update_purchase_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_purchase_updated_at
    BEFORE UPDATE ON purchases
    FOR EACH ROW
    EXECUTE FUNCTION update_purchase_updated_at();

-- ===========================================
-- SAMPLE DATA
-- ===========================================

-- Insert sample categories
INSERT INTO categories (id, name, image_url) VALUES
    (gen_random_uuid(), 'E-commerce', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop'),
    (gen_random_uuid(), 'Social Media', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop'),
    (gen_random_uuid(), 'Analytics', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop'),
    (gen_random_uuid(), 'Customer Service', 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&h=200&fit=crop'),
    (gen_random_uuid(), 'Marketing', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop');

-- Insert sample admin user
INSERT INTO users (id, name, avatar_url, email, password_hash, role, is_deleted) VALUES
    (gen_random_uuid(), 'Admin User', 'https://images.unsplash.com/photo-1535713875002-d1d0cfce72b3?w=32&h=32&fit=crop&crop=face', 'admin@usitech.io.vn', '$2b$10$example_hash', 'ADMIN', false);

-- ===========================================
-- VIEWS
-- ===========================================

-- User statistics view
CREATE VIEW user_stats AS
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN is_deleted = false THEN 1 END) as active_users,
    COUNT(CASE WHEN is_deleted = true THEN 1 END) as banned_users,
    COUNT(CASE WHEN created_at >= CURRENT_DATE THEN 1 END) as new_users_today,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as new_users_this_week,
    COUNT(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 END) as new_users_this_month
FROM users;

-- Workflow statistics view
CREATE VIEW workflow_stats AS
SELECT 
    COUNT(*) as total_workflows,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_workflows,
    COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired_workflows,
    SUM(downloads_count) as total_downloads,
    COALESCE(SUM(p.amount), 0) as total_revenue
FROM workflows w
LEFT JOIN purchases p ON w.id = p.workflow_id AND p.status = 'ACTIVE';

-- Purchase statistics view
CREATE VIEW purchase_stats AS
SELECT 
    COUNT(*) as total_purchases,
    COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active_purchases,
    COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending_purchases,
    COUNT(CASE WHEN status = 'REJECT' THEN 1 END) as rejected_purchases,
    COALESCE(SUM(CASE WHEN status = 'ACTIVE' THEN amount ELSE 0 END), 0) as total_revenue,
    COALESCE(SUM(CASE WHEN status = 'ACTIVE' AND created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN amount ELSE 0 END), 0) as revenue_this_month
FROM purchases;

-- Notification statistics view
CREATE VIEW notification_stats AS
SELECT 
    COUNT(*) as total_notifications,
    COUNT(CASE WHEN is_unread = true THEN 1 END) as unread_notifications,
    COUNT(CASE WHEN type = 'SUCCESS' THEN 1 END) as success_notifications,
    COUNT(CASE WHEN type = 'WARNING' THEN 1 END) as warning_notifications,
    COUNT(CASE WHEN type = 'ERROR' THEN 1 END) as error_notifications
FROM notifications;

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    invoice_number TEXT;
    counter INTEGER;
BEGIN
    -- Get current counter value
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 4) AS INTEGER)), 0) + 1
    INTO counter
    FROM invoices
    WHERE invoice_number LIKE 'INV%';
    
    -- Generate invoice number
    invoice_number := 'INV' || LPAD(counter::TEXT, 6, '0');
    
    RETURN invoice_number;
END;
$$ LANGUAGE plpgsql;

-- Function to update workflow rating
CREATE OR REPLACE FUNCTION update_workflow_rating(workflow_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE workflows 
    SET rating_avg = (
        SELECT AVG(rating)::NUMERIC(3,2)
        FROM comments 
        WHERE workflow_id = workflow_id
    )
    WHERE id = workflow_id;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- PERMISSIONS
-- ===========================================

-- Create admin role
CREATE ROLE admin_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin_role;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO admin_role;

-- Create user role
CREATE ROLE user_role;
GRANT SELECT, INSERT, UPDATE ON users TO user_role;
GRANT SELECT ON workflows TO user_role;
GRANT SELECT, INSERT, UPDATE ON purchases TO user_role;
GRANT SELECT, INSERT ON comments TO user_role;
GRANT SELECT, INSERT, DELETE ON favorites TO user_role;
GRANT SELECT ON notifications TO user_role;

-- ===========================================
-- COMMENTS
-- ===========================================

COMMENT ON TABLE users IS 'User accounts and profiles';
COMMENT ON TABLE notifications IS 'System notifications for users';
COMMENT ON TABLE contact_messages IS 'Contact form submissions';
COMMENT ON TABLE workflows IS 'Workflow templates and definitions';
COMMENT ON TABLE categories IS 'Workflow categories';
COMMENT ON TABLE workflow_categories IS 'Many-to-many relationship between workflows and categories';
COMMENT ON TABLE workflow_assets IS 'Files and assets associated with workflows';
COMMENT ON TABLE favorites IS 'User favorite workflows';
COMMENT ON TABLE comments IS 'User comments and ratings on workflows';
COMMENT ON TABLE purchases IS 'User purchases of workflows';
COMMENT ON TABLE invoices IS 'Generated invoices for purchases';

COMMENT ON COLUMN users.is_deleted IS 'Soft delete flag - true means user is banned';
COMMENT ON COLUMN workflows.features IS 'Array of key features for the workflow';
COMMENT ON COLUMN workflows.flow IS 'JSON definition of the workflow steps';
COMMENT ON COLUMN purchases.amount IS 'Amount in VND (Vietnamese Dong)';
COMMENT ON COLUMN purchases.paid_at IS 'Timestamp when payment was completed';
COMMENT ON COLUMN invoices.invoice_number IS 'Auto-generated invoice number';

