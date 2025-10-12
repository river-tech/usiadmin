# UsITech Admin Portal

A modern, professional admin dashboard built with Next.js, TypeScript, TailwindCSS, and shadcn/ui for managing workflow automation templates.

## 🚀 Features

### 🔐 Authentication
- Secure login page with gradient design
- 2FA enabled security indicators
- IP restriction notices
- Admin role badges

### 📊 Dashboard
- Real-time metrics and KPIs
- Sales overview charts
- Recent activity feed
- Recent purchases summary
- Responsive design

### 🔧 Workflow Management
- **Workflow List**: View, search, and manage all workflows
- **Upload Workflow**: Step-by-step workflow creation
- **Edit Workflow**: Modify existing workflows
- **Workflow Stats**: Performance metrics and analytics

### 👥 User Management
- User account overview
- Activity tracking
- Purchase history
- Status management
- Export capabilities

### 💰 Purchase Tracking
- Transaction logs
- Payment status tracking
- Revenue analytics
- Filter and search functionality

### ⚙️ System Settings
- **Storage**: File upload configuration
- **Stripe**: Payment processing setup
- **Maintenance**: System maintenance controls
- **Notifications**: Email and webhook settings

### 📈 Analytics
- Revenue trends
- Workflow category distribution
- Top-selling workflows
- Performance metrics

### 📋 System Logs
- Admin action tracking
- Activity monitoring
- Audit trail
- Export functionality

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Date Handling**: date-fns
- **Theme**: next-themes (ready for dark mode)

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx          # Login page
│   ├── (protected)/
│   │   ├── dashboard/page.tsx      # Main dashboard
│   │   ├── workflows/              # Workflow management
│   │   │   ├── page.tsx
│   │   │   ├── upload/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── users/page.tsx          # User management
│   │   ├── purchases/page.tsx     # Purchase tracking
│   │   ├── settings/page.tsx       # System settings
│   │   ├── logs/page.tsx          # System logs
│   │   └── analytics/page.tsx      # Analytics dashboard
│   ├── error/page.tsx             # Error page
│   └── layout.tsx                 # Root layout
├── components/
│   ├── layout/                    # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── LayoutWrapper.tsx
│   ├── dashboard/                 # Dashboard components
│   │   ├── MetricsCards.tsx
│   │   ├── SalesChart.tsx
│   │   ├── RecentActivity.tsx
│   │   └── RecentPurchases.tsx
│   ├── workflows/                 # Workflow components
│   │   ├── WorkflowTable.tsx
│   │   ├── WorkflowForm.tsx
│   │   └── WorkflowStats.tsx
│   ├── users/                       # User components
│   │   ├── UserTable.tsx
│   │   └── UserSummaryCard.tsx
│   ├── purchases/                # Purchase components
│   │   ├── PurchaseTable.tsx
│   │   └── PurchaseStats.tsx
│   ├── settings/                  # Settings components
│   │   ├── StorageSettings.tsx
│   │   ├── StripeSettings.tsx
│   │   ├── MaintenanceSettings.tsx
│   │   └── NotificationSettings.tsx
│   └── ui/                        # Reusable UI components
│       ├── StatCard.tsx
│       ├── StatusBadge.tsx
│       ├── PageHeader.tsx
│       ├── EmptyState.tsx
│       └── ConfirmDialog.tsx
├── lib/
│   ├── types.ts                   # TypeScript definitions
│   ├── mock-data.ts              # Sample data
│   └── utils.ts                  # Utility functions
└── styles/
    └── globals.css               # Global styles
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (`#002B6B` to `#007BFF`)
- **Sidebar**: Dark gradient (`#0B1628` to `#1a2332`)
- **Cards**: White with subtle shadows
- **Status Colors**: Semantic color coding

### Typography
- **Font**: Inter (system font stack)
- **Headings**: Bold, clear hierarchy
- **Body**: Readable, accessible contrast

### Components
- **Cards**: Rounded corners (`rounded-2xl`)
- **Shadows**: Subtle depth (`shadow-[0_2px_8px_rgba(0,0,0,0.05)]`)
- **Animations**: Smooth transitions
- **Responsive**: Mobile-first design

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd usitech-admin-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

```env
# Add your environment variables here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Customization

1. **Colors**: Modify `src/app/globals.css`
2. **Components**: Update shadcn/ui components
3. **Data**: Replace mock data in `src/lib/mock-data.ts`
4. **Types**: Extend types in `src/lib/types.ts`

## 📱 Responsive Design

- **Mobile**: Collapsible sidebar, stacked layouts
- **Tablet**: Optimized spacing and navigation
- **Desktop**: Full sidebar, multi-column layouts

## 🔒 Security Features

- **IP Restrictions**: Configurable IP allowlist
- **2FA Ready**: Two-factor authentication indicators
- **Role-based Access**: Admin role management
- **Secure Headers**: Security-focused meta tags

## 🎯 Key Features

### Dashboard
- Real-time metrics
- Interactive charts
- Activity feeds
- Quick actions

### Workflow Management
- Step-by-step upload process
- JSON file validation
- Category organization
- Pricing management
- Status tracking

### User Management
- User profiles
- Activity monitoring
- Purchase history
- Status management

### Analytics
- Revenue tracking
- Performance metrics
- Category analysis
- Trend visualization

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically

### Other Platforms
- **Netlify**: Static site generation
- **Railway**: Full-stack deployment
- **Docker**: Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- **Email**: support@usitech.io.vn
- **Documentation**: [Link to docs]
- **Issues**: GitHub Issues

---

**Built with ❤️ for UsITech Admin Portal**