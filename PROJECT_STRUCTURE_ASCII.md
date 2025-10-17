# 🏗️ USITECH ADMIN PORTAL - ASCII STRUCTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           USITECH ADMIN PORTAL                                  │
│                         Next.js 15.5.4 + TypeScript                            │
└─────────────────────────────────────────────────────────────────────────────────┘

📁 usiadmin/
├── 📄 Configuration Files
│   ├── package.json                 # Dependencies & scripts
│   ├── next.config.ts              # Next.js configuration  
│   ├── tsconfig.json               # TypeScript configuration
│   ├── eslint.config.mjs           # ESLint configuration
│   ├── postcss.config.mjs          # PostCSS configuration
│   ├── components.json              # shadcn/ui configuration
│   └── next-env.d.ts               # Next.js type definitions
│
├── 📄 Documentation Files
│   ├── README.md                   # Project documentation
│   ├── DATABASE_ANALYSIS.md        # Database schema analysis
│   ├── admin-db-audit.md           # Database audit report
│   ├── admin-db-optimize.md         # Database optimization
│   ├── admin-db-final.md           # Final database alignment
│   ├── admin-schema-aligned.md     # Schema alignment report
│   ├── admin-final-alignment.md    # Final alignment report
│   ├── modal-background-fix.md     # Modal fixes documentation
│   └── workflow-form-analysis.md   # Workflow form analysis
│
├── 📄 Database Files
│   ├── database-schema.sql          # Complete PostgreSQL schema
│   └── admin-db-status.txt         # Database readiness status
│
├── 📁 public/                      # Static assets
│   ├── favicon.ico
│   ├── next.svg
│   ├── vercel.svg
│   ├── file.svg
│   ├── globe.svg
│   └── window.svg
│
├── 📁 node_modules/               # Dependencies
└── 📁 src/                        # Source code
    │
    ├── 📁 app/                    # Next.js App Router
    │   ├── 📄 layout.tsx          # Root layout with AlertProvider
    │   ├── 📄 page.tsx            # Home page (redirects to login)
    │   ├── 📄 globals.css         # Global styles & TailwindCSS
    │   ├── 📄 favicon.ico         # Site favicon
    │   │
    │   ├── 📁 (auth)/             # Authentication routes
    │   │   ├── 📄 layout.tsx      # Auth layout
    │   │   └── 📁 login/
    │   │       └── 📄 page.tsx    # Login page
    │   │
    │   ├── 📁 (protected)/        # Protected admin routes
    │   │   ├── 📄 layout.tsx      # Protected layout with LayoutWrapper
    │   │   ├── 📁 dashboard/
    │   │   │   └── 📄 page.tsx    # Dashboard overview
    │   │   ├── 📁 users/
    │   │   │   └── 📄 page.tsx    # User management
    │   │   ├── 📁 workflows/
    │   │   │   ├── 📄 page.tsx    # Workflow list
    │   │   │   ├── 📁 upload/
    │   │   │   │   └── 📄 page.tsx # Upload workflow
    │   │   │   └── 📁 [id]/
    │   │   │       ├── 📄 page.tsx # View workflow details
    │   │   │       └── 📁 edit/
    │   │   │           └── 📄 page.tsx # Edit workflow
    │   │   ├── 📁 purchases/
    │   │   │   └── 📄 page.tsx    # Purchase management
    │   │   ├── 📁 notifications/
    │   │   │   └── 📄 page.tsx    # Notifications & logs
    │   │   ├── 📁 settings/
    │   │   │   └── 📄 page.tsx    # Admin management
    │   │   ├── 📁 profile/
    │   │   │   └── 📄 page.tsx    # User profile
    │   │   └── 📁 analytics/
    │   │       └── 📄 page.tsx    # Analytics (commented out)
    │   │
    │   └── 📁 error/
    │       └── 📄 page.tsx         # Error page
    │
    ├── 📁 components/              # React components
    │   ├── 📁 layout/              # Layout components
    │   │   ├── 📄 LayoutWrapper.tsx # Main layout wrapper
    │   │   ├── 📄 Header.tsx       # Top navigation header
    │   │   └── 📄 Sidebar.tsx      # Left sidebar navigation
    │   │
    │   ├── 📁 ui/                  # Reusable UI components
    │   │   ├── 📄 Alert.tsx        # Alert notification system
    │   │   ├── 📄 ConfirmDialog.tsx # Confirmation dialog
    │   │   ├── 📄 StatusBadge.tsx  # Status indicator badges
    │   │   ├── 📄 CategoryBadge.tsx # Category display badges
    │   │   ├── 📄 PageHeader.tsx   # Page title component
    │   │   ├── 📄 StatCard.tsx     # Statistics card
    │   │   ├── 📄 EmptyState.tsx   # Empty state component
    │   │   ├── 📄 skeleton.tsx     # Loading skeleton
    │   │   ├── 📄 button.tsx       # Button component
    │   │   ├── 📄 input.tsx        # Input component
    │   │   ├── 📄 textarea.tsx     # Textarea component
    │   │   ├── 📄 card.tsx         # Card component
    │   │   ├── 📄 table.tsx        # Table component
    │   │   ├── 📄 tabs.tsx         # Tabs component
    │   │   ├── 📄 dialog.tsx        # Dialog component
    │   │   ├── 📄 dropdown-menu.tsx # Dropdown menu
    │   │   ├── 📄 avatar.tsx       # Avatar component
    │   │   ├── 📄 badge.tsx        # Badge component
    │   │   ├── 📄 checkbox.tsx     # Checkbox component
    │   │   ├── 📄 label.tsx        # Label component
    │   │   ├── 📄 switch.tsx       # Switch component
    │   │   └── 📄 tooltip.tsx      # Tooltip component
    │   │
    │   ├── 📁 dashboard/            # Dashboard components
    │   │   ├── 📄 MetricsCards.tsx # Dashboard metrics
    │   │   ├── 📄 SalesChart.tsx   # Sales chart
    │   │   ├── 📄 RecentActivity.tsx # Recent activity feed
    │   │   └── 📄 RecentPurchases.tsx # Recent purchases
    │   │
    │   ├── 📁 users/               # User management components
    │   │   ├── 📄 UserTable.tsx    # User data table
    │   │   └── 📄 UserSummaryCard.tsx # User summary card
    │   │
    │   ├── 📁 workflows/            # Workflow management components
    │   │   ├── 📄 WorkflowTable.tsx # Workflow data table
    │   │   ├── 📄 WorkflowForm.tsx  # Workflow creation/edit form
    │   │   └── 📄 WorkflowStats.tsx # Workflow statistics
    │   │
    │   ├── 📁 purchases/           # Purchase management components
    │   │   ├── 📄 PurchaseTable.tsx # Purchase data table
    │   │   └── 📄 PurchaseStats.tsx # Purchase statistics
    │   │
    │   └── 📁 settings/             # Settings components (empty)
    │
    ├── 📁 contexts/                # React Context providers
    │   └── 📄 AlertContext.tsx     # Global alert system
    │
    └── 📁 lib/                     # Utility libraries
        ├── 📄 types.ts             # TypeScript type definitions
        ├── 📄 models.ts            # Database models & interfaces
        ├── 📄 database-queries.ts  # SQL queries & database operations
        ├── 📄 mock-data.ts         # Mock data for development
        └── 📄 utils.ts             # Utility functions
```

## 🔄 DATA FLOW DIAGRAM

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Action   │───▶│  React Component │───▶│   Alert System   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Mock Data     │
                       │   (Development) │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  Database       │
                       │  Models &       │
                       │  Queries        │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  PostgreSQL     │
                       │  Database       │
                       └─────────────────┘
```

## 🎯 COMPONENT HIERARCHY

```
App Layout
├── AlertProvider
│   ├── AlertContainer
│   └── Protected Layout
│       └── LayoutWrapper
│           ├── Sidebar
│           │   ├── Navigation Items
│           │   └── User Info
│           ├── Header
│           │   ├── Page Title
│           │   ├── Search Bar
│           │   ├── Notifications
│           │   └── User Avatar
│           └── Main Content
│               ├── Dashboard
│               │   ├── MetricsCards
│               │   ├── SalesChart
│               │   ├── RecentActivity
│               │   └── RecentPurchases
│               ├── Users
│               │   ├── UserTable
│               │   └── UserSummaryCard
│               ├── Workflows
│               │   ├── WorkflowTable
│               │   ├── WorkflowForm
│               │   └── WorkflowStats
│               ├── Purchases
│               │   ├── PurchaseTable
│               │   └── PurchaseStats
│               ├── Notifications
│               │   └── NotificationList
│               └── Settings
│                   └── AdminManagement
```

## 🗄️ DATABASE SCHEMA OVERVIEW

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     users       │    │   workflows     │    │   purchases     │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (UUID)       │    │ id (UUID)       │    │ id (UUID)       │
│ name (VARCHAR)  │    │ title (VARCHAR) │    │ user_id (UUID)  │
│ avatar_url      │    │ description     │    │ workflow_id     │
│ email (VARCHAR) │    │ price (NUMERIC) │    │ bank_account    │
│ password_hash   │    │ status (ENUM)   │    │ bank_name       │
│ role (ENUM)     │    │ features (TEXT[])│    │ transfer_code   │
│ is_deleted      │    │ downloads_count │    │ amount (NUMERIC)│
│ created_at      │    │ time_to_setup   │    │ status (ENUM)   │
└─────────────────┘    │ video_demo      │    │ payment_method  │
                        │ flow (JSONB)    │    │ paid_at         │
                        │ rating_avg      │    │ created_at      │
                        │ created_at      │    │ updated_at      │
                        │ updated_at      │    └─────────────────┘
                        └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  notifications  │
                       ├─────────────────┤
                       │ id (UUID)       │
                       │ user_id (UUID)  │
                       │ title (VARCHAR) │
                       │ message (TEXT)   │
                       │ type (ENUM)      │
                       │ is_unread       │
                       │ created_at      │
                       └─────────────────┘
```

## 🎨 UI COMPONENT LIBRARY

```
shadcn/ui Components
├── Button (with variants)
│   ├── default
│   ├── destructive
│   ├── outline
│   ├── secondary
│   ├── ghost
│   └── destructive-red
├── Input (with focus styles)
├── Textarea (with focus styles)
├── Card (with variants)
├── Table (sortable, filterable)
├── Dialog (modal system)
├── DropdownMenu (with z-index fixes)
├── Tabs (with focus styles)
├── Badge (status indicators)
├── Avatar (user images)
├── Checkbox (form controls)
├── Switch (toggle controls)
├── Label (form labels)
├── Tooltip (hover information)
└── Skeleton (loading states)

Custom Components
├── Alert (success/error notifications)
├── ConfirmDialog (confirmation modals)
├── StatusBadge (color-coded status)
├── CategoryBadge (light blue rounded)
├── PageHeader (page titles)
├── StatCard (metric displays)
└── EmptyState (empty data states)
```

## 🚀 DEVELOPMENT WORKFLOW

```
Development Process
├── 1. Feature Planning
│   ├── Database schema design
│   ├── Component architecture
│   └── API endpoint planning
├── 2. Implementation
│   ├── Database models & queries
│   ├── React components
│   ├── Page layouts
│   └── State management
├── 3. Testing
│   ├── Component testing
│   ├── Integration testing
│   └── User acceptance testing
├── 4. Deployment
│   ├── Build optimization
│   ├── Production deployment
│   └── Performance monitoring
└── 5. Maintenance
    ├── Bug fixes
    ├── Feature updates
    └── Performance optimization
```

## 📊 PROJECT METRICS

```
Code Statistics
├── Total Files: 80+
├── Components: 25+
├── Pages: 15+
├── Database Tables: 12
├── Enums: 5
├── Lines of Code: 5,000+
├── Dependencies: 20+
└── Documentation Files: 10+

Technology Stack
├── Frontend: Next.js 15.5.4
├── Language: TypeScript 5
├── Styling: TailwindCSS v4
├── UI Library: Radix UI + shadcn/ui
├── Icons: Lucide React
├── Animations: Framer Motion
├── State: React Context API
└── Database: PostgreSQL
```

---

*This ASCII structure diagram provides a comprehensive overview of the UsITech Admin Portal project architecture, showing the complete file organization, component hierarchy, data flow, and technical stack.*
