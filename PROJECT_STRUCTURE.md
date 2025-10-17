# 🏗️ USITECH ADMIN PORTAL - PROJECT STRUCTURE

## 📋 OVERVIEW
**Project Name**: UsITech Admin Portal  
**Framework**: Next.js 15.5.4 (App Router)  
**Language**: TypeScript 5  
**Styling**: TailwindCSS v4  
**UI Library**: Radix UI + shadcn/ui  
**State Management**: React Context API  
**Database**: PostgreSQL (with custom models & queries)

---

## 📁 ROOT DIRECTORY STRUCTURE

```
usiadmin/
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
```

---

## 📁 SOURCE CODE STRUCTURE (`src/`)

```
src/
├── 📁 app/                         # Next.js App Router
│   ├── 📄 layout.tsx              # Root layout with AlertProvider
│   ├── 📄 page.tsx                # Home page (redirects to login)
│   ├── 📄 globals.css             # Global styles & TailwindCSS
│   ├── 📄 favicon.ico             # Site favicon
│   │
│   ├── 📁 (auth)/                 # Authentication routes
│   │   ├── 📄 layout.tsx          # Auth layout
│   │   └── 📁 login/
│   │       └── 📄 page.tsx        # Login page
│   │
│   ├── 📁 (protected)/            # Protected admin routes
│   │   ├── 📄 layout.tsx          # Protected layout with LayoutWrapper
│   │   ├── 📁 dashboard/
│   │   │   └── 📄 page.tsx       # Dashboard overview
│   │   ├── 📁 users/
│   │   │   └── 📄 page.tsx       # User management
│   │   ├── 📁 workflows/
│   │   │   ├── 📄 page.tsx       # Workflow list
│   │   │   ├── 📁 upload/
│   │   │   │   └── 📄 page.tsx  # Upload workflow
│   │   │   └── 📁 [id]/
│   │   │       ├── 📄 page.tsx  # View workflow details
│   │   │       └── 📁 edit/
│   │   │           └── 📄 page.tsx # Edit workflow
│   │   ├── 📁 purchases/
│   │   │   └── 📄 page.tsx       # Purchase management
│   │   ├── 📁 notifications/
│   │   │   └── 📄 page.tsx       # Notifications & logs
│   │   ├── 📁 settings/
│   │   │   └── 📄 page.tsx       # Admin management
│   │   ├── 📁 profile/
│   │   │   └── 📄 page.tsx       # User profile
│   │   └── 📁 analytics/
│   │       └── 📄 page.tsx       # Analytics (commented out)
│   │
│   └── 📁 error/
│       └── 📄 page.tsx           # Error page
│
├── 📁 components/                 # React components
│   ├── 📁 layout/                 # Layout components
│   │   ├── 📄 LayoutWrapper.tsx  # Main layout wrapper
│   │   ├── 📄 Header.tsx         # Top navigation header
│   │   └── 📄 Sidebar.tsx        # Left sidebar navigation
│   │
│   ├── 📁 ui/                     # Reusable UI components
│   │   ├── 📄 Alert.tsx          # Alert notification system
│   │   ├── 📄 ConfirmDialog.tsx  # Confirmation dialog
│   │   ├── 📄 StatusBadge.tsx     # Status indicator badges
│   │   ├── 📄 CategoryBadge.tsx   # Category display badges
│   │   ├── 📄 PageHeader.tsx     # Page title component
│   │   ├── 📄 StatCard.tsx       # Statistics card
│   │   ├── 📄 EmptyState.tsx     # Empty state component
│   │   ├── 📄 skeleton.tsx       # Loading skeleton
│   │   ├── 📄 button.tsx          # Button component
│   │   ├── 📄 input.tsx          # Input component
│   │   ├── 📄 textarea.tsx       # Textarea component
│   │   ├── 📄 card.tsx           # Card component
│   │   ├── 📄 table.tsx          # Table component
│   │   ├── 📄 tabs.tsx           # Tabs component
│   │   ├── 📄 dialog.tsx         # Dialog component
│   │   ├── 📄 dropdown-menu.tsx  # Dropdown menu
│   │   ├── 📄 avatar.tsx         # Avatar component
│   │   ├── 📄 badge.tsx          # Badge component
│   │   ├── 📄 checkbox.tsx       # Checkbox component
│   │   ├── 📄 label.tsx          # Label component
│   │   ├── 📄 switch.tsx         # Switch component
│   │   ├── 📄 tooltip.tsx        # Tooltip component
│   │   └── 📄 index.ts           # Component exports
│   │
│   ├── 📁 dashboard/             # Dashboard components
│   │   ├── 📄 MetricsCards.tsx   # Dashboard metrics
│   │   ├── 📄 SalesChart.tsx     # Sales chart
│   │   ├── 📄 RecentActivity.tsx # Recent activity feed
│   │   └── 📄 RecentPurchases.tsx # Recent purchases
│   │
│   ├── 📁 users/                 # User management components
│   │   ├── 📄 UserTable.tsx      # User data table
│   │   └── 📄 UserSummaryCard.tsx # User summary card
│   │
│   ├── 📁 workflows/             # Workflow management components
│   │   ├── 📄 WorkflowTable.tsx  # Workflow data table
│   │   ├── 📄 WorkflowForm.tsx   # Workflow creation/edit form
│   │   └── 📄 WorkflowStats.tsx  # Workflow statistics
│   │
│   ├── 📁 purchases/              # Purchase management components
│   │   ├── 📄 PurchaseTable.tsx  # Purchase data table
│   │   └── 📄 PurchaseStats.tsx  # Purchase statistics
│   │
│   └── 📁 settings/              # Settings components (empty)
│
├── 📁 contexts/                  # React Context providers
│   └── 📄 AlertContext.tsx       # Global alert system
│
└── 📁 lib/                       # Utility libraries
    ├── 📄 types.ts               # TypeScript type definitions
    ├── 📄 models.ts               # Database models & interfaces
    ├── 📄 database-queries.ts    # SQL queries & database operations
    ├── 📄 mock-data.ts           # Mock data for development
    └── 📄 utils.ts               # Utility functions
```

---

## 🔧 TECHNICAL ARCHITECTURE

### **Frontend Stack**
- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS v4
- **UI Components**: Radix UI primitives + shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Date Handling**: date-fns
- **State Management**: React Context API

### **Backend Integration**
- **Database**: PostgreSQL
- **ORM**: Custom models & queries
- **Authentication**: Role-based (USER/ADMIN)
- **API**: Next.js API routes (planned)

### **Key Dependencies**
```json
{
  "next": "15.5.4",
  "react": "19.1.0",
  "typescript": "^5",
  "tailwindcss": "^4",
  "@radix-ui/react-*": "^1.x.x",
  "lucide-react": "^0.545.0",
  "framer-motion": "^12.23.22",
  "date-fns": "^4.1.0"
}
```

---

## 🎯 FEATURE MODULES

### **1. Authentication & Authorization**
- **Login System**: Role-based authentication
- **Protected Routes**: Admin-only access
- **User Roles**: USER, ADMIN

### **2. Dashboard**
- **Metrics Cards**: User, workflow, purchase statistics
- **Charts**: Sales analytics
- **Recent Activity**: Latest system events
- **Quick Actions**: Common admin tasks

### **3. User Management**
- **User List**: Search, filter, sort users
- **User Details**: Profile information
- **Ban/Unban**: User account management
- **Statistics**: User activity metrics

### **4. Workflow Management**
- **Workflow List**: Browse all workflows
- **Upload Workflow**: Create new workflows
- **Edit Workflow**: Modify existing workflows
- **View Details**: Workflow information
- **Categories**: Workflow categorization
- **Assets**: File management

### **5. Purchase Management**
- **Purchase List**: All transactions
- **Status Management**: PENDING/ACTIVE/REJECT
- **Payment Tracking**: Bank transfer codes
- **Invoice Generation**: Automatic invoicing

### **6. Notifications & Logs**
- **System Notifications**: SUCCESS/WARNING/ERROR
- **Activity Logs**: Admin actions
- **Mark as Read**: Notification management
- **Export**: Data export functionality

### **7. Admin Settings**
- **Create Admin**: Add new admin users
- **Delete Admin**: Remove admin accounts
- **Change Password**: Password management
- **User Management**: Admin user controls

---

## 🗄️ DATABASE ARCHITECTURE

### **Core Tables**
- **users**: User accounts & profiles
- **workflows**: Workflow templates
- **purchases**: Transaction records
- **notifications**: System notifications
- **categories**: Workflow categories
- **workflow_assets**: File attachments
- **invoices**: Generated invoices

### **Enums**
- **user_role**: USER, ADMIN
- **workflow_status**: active, expired
- **purchase_status**: ACTIVE, PENDING, REJECT
- **payment_method**: QR
- **enoti**: SUCCESS, WARNING, ERROR

### **Key Features**
- **Soft Delete**: `is_deleted` flag for users
- **Audit Trail**: Created/updated timestamps
- **Relationships**: Foreign key constraints
- **Indexes**: Performance optimization
- **Views**: Pre-computed statistics

---

## 🎨 UI/UX DESIGN SYSTEM

### **Color Palette**
- **Primary**: Blue gradient (`bg-gradient-brand`)
- **Success**: Green (`bg-green-100`, `text-green-800`)
- **Warning**: Yellow (`bg-yellow-100`, `text-yellow-800`)
- **Error**: Red (`bg-red-100`, `text-red-800`)
- **Neutral**: Gray scale

### **Components**
- **Status Badges**: Color-coded status indicators
- **Category Badges**: Light blue rounded tags
- **Buttons**: Gradient primary, destructive red
- **Cards**: Clean white backgrounds
- **Tables**: Sortable, filterable data grids

### **Responsive Design**
- **Mobile**: Collapsible sidebar
- **Tablet**: Optimized layouts
- **Desktop**: Full sidebar navigation

---

## 🚀 DEVELOPMENT WORKFLOW

### **Scripts**
```bash
npm run dev      # Development server with Turbopack
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint checking
```

### **File Organization**
- **Pages**: Next.js App Router structure
- **Components**: Feature-based organization
- **Types**: Centralized type definitions
- **Utils**: Reusable utility functions
- **Contexts**: Global state management

### **Code Quality**
- **TypeScript**: Strict type checking
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TailwindCSS**: Utility-first styling

---

## 📊 PROJECT STATISTICS

- **Total Files**: 80+ files
- **Components**: 25+ React components
- **Pages**: 15+ Next.js pages
- **Database Tables**: 12 tables
- **Enums**: 5 enums
- **Lines of Code**: 5,000+ lines
- **Dependencies**: 20+ packages

---

## 🔮 FUTURE ENHANCEMENTS

### **Planned Features**
- **API Routes**: Backend API endpoints
- **Real-time Updates**: WebSocket integration
- **Advanced Analytics**: Charts and reports
- **Bulk Operations**: Mass user/workflow actions
- **Export/Import**: Data management tools
- **Audit Logs**: Detailed activity tracking

### **Technical Improvements**
- **Database Integration**: Real PostgreSQL connection
- **Authentication**: JWT token system
- **File Upload**: Cloud storage integration
- **Caching**: Redis for performance
- **Testing**: Unit and integration tests
- **CI/CD**: Automated deployment

---

*This project structure represents a comprehensive admin portal for UsITech workflow management, built with modern web technologies and best practices.*
