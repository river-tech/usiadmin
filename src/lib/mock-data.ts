import { User, Workflow, Purchase, Activity, Analytics, Settings } from './types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    joinDate: '2024-01-15',
    purchases: 5,
    totalSpent: 299.95,
    status: 'active',
    lastActive: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    joinDate: '2024-01-10',
    purchases: 3,
    totalSpent: 179.97,
    status: 'active',
    lastActive: '2024-01-19T14:20:00Z'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    joinDate: '2024-01-05',
    purchases: 8,
    totalSpent: 479.92,
    status: 'active',
    lastActive: '2024-01-20T09:15:00Z'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    joinDate: '2023-12-20',
    purchases: 2,
    totalSpent: 119.98,
    status: 'inactive',
    lastActive: '2024-01-10T16:45:00Z'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
    joinDate: '2024-01-18',
    purchases: 1,
    totalSpent: 59.99,
    status: 'active',
    lastActive: '2024-01-20T11:30:00Z'
  }
];

// Mock Workflows
export const mockWorkflows: Workflow[] = [
  {
    id: '1',
    title: 'E-commerce Automation',
    description: 'Complete automation workflow for e-commerce stores including inventory management, order processing, and customer support.',
    category: 'E-commerce',
    price: 99.99,
    sales: 45,
    revenue: 4499.55,
    created: '2024-01-01',
    updated: '2024-01-15',
    status: 'published',
    tags: ['automation', 'ecommerce', 'inventory'],
    previewImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop'
  },
  {
    id: '2',
    title: 'Social Media Manager',
    description: 'Automated social media posting, engagement tracking, and content scheduling across multiple platforms.',
    category: 'Social Media',
    price: 79.99,
    sales: 32,
    revenue: 2559.68,
    created: '2024-01-05',
    updated: '2024-01-18',
    status: 'published',
    tags: ['social', 'automation', 'scheduling'],
    previewImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop'
  },
  {
    id: '3',
    title: 'Data Analytics Pipeline',
    description: 'Comprehensive data collection, processing, and visualization workflow for business intelligence.',
    category: 'Analytics',
    price: 149.99,
    sales: 18,
    revenue: 2699.82,
    created: '2024-01-08',
    updated: '2024-01-20',
    status: 'published',
    tags: ['analytics', 'data', 'visualization'],
    previewImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop'
  },
  {
    id: '4',
    title: 'Customer Support Bot',
    description: 'AI-powered customer support automation with ticket routing, response generation, and escalation management.',
    category: 'Customer Service',
    price: 129.99,
    sales: 25,
    revenue: 3249.75,
    created: '2024-01-12',
    updated: '2024-01-19',
    status: 'published',
    tags: ['ai', 'support', 'automation'],
    previewImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&h=200&fit=crop'
  },
  {
    id: '5',
    title: 'Email Marketing Campaign',
    description: 'Automated email marketing workflow with segmentation, personalization, and performance tracking.',
    category: 'Marketing',
    price: 89.99,
    sales: 28,
    revenue: 2519.72,
    created: '2024-01-14',
    updated: '2024-01-20',
    status: 'draft',
    tags: ['email', 'marketing', 'automation'],
    previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
  }
];

// Mock Purchases
export const mockPurchases: Purchase[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    workflowId: '1',
    workflowTitle: 'E-commerce Automation',
    amount: 99.99,
    date: '2024-01-20T10:30:00Z',
    paymentMethod: 'stripe',
    status: 'completed',
    transactionId: 'txn_123456789'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Jane Smith',
    userEmail: 'jane.smith@example.com',
    workflowId: '2',
    workflowTitle: 'Social Media Manager',
    amount: 79.99,
    date: '2024-01-19T14:20:00Z',
    paymentMethod: 'stripe',
    status: 'completed',
    transactionId: 'txn_123456790'
  },
  {
    id: '3',
    userId: '3',
    userName: 'Mike Johnson',
    userEmail: 'mike.johnson@example.com',
    workflowId: '3',
    workflowTitle: 'Data Analytics Pipeline',
    amount: 149.99,
    date: '2024-01-18T09:15:00Z',
    paymentMethod: 'stripe',
    status: 'completed',
    transactionId: 'txn_123456791'
  },
  {
    id: '4',
    userId: '1',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    workflowId: '4',
    workflowTitle: 'Customer Support Bot',
    amount: 129.99,
    date: '2024-01-17T16:45:00Z',
    paymentMethod: 'stripe',
    status: 'pending',
    transactionId: 'txn_123456792'
  },
  {
    id: '5',
    userId: '5',
    userName: 'David Brown',
    userEmail: 'david.brown@example.com',
    workflowId: '1',
    workflowTitle: 'E-commerce Automation',
    amount: 99.99,
    date: '2024-01-16T11:30:00Z',
    paymentMethod: 'stripe',
    status: 'completed',
    transactionId: 'txn_123456793'
  }
];

// Mock Activities
export const mockActivities: Activity[] = [
  {
    id: '1',
    admin: 'Admin User',
    action: 'Published workflow',
    target: 'E-commerce Automation',
    timestamp: '2024-01-20T10:30:00Z',
    details: 'Workflow published and made available for purchase'
  },
  {
    id: '2',
    admin: 'Admin User',
    action: 'User registered',
    target: 'john.doe@example.com',
    timestamp: '2024-01-20T09:15:00Z',
    details: 'New user account created'
  },
  {
    id: '3',
    admin: 'Admin User',
    action: 'Purchase completed',
    target: 'E-commerce Automation',
    timestamp: '2024-01-20T08:45:00Z',
    details: 'Purchase completed for $99.99'
  },
  {
    id: '4',
    admin: 'Admin User',
    action: 'Workflow updated',
    target: 'Social Media Manager',
    timestamp: '2024-01-19T14:20:00Z',
    details: 'Workflow configuration updated'
  },
  {
    id: '5',
    admin: 'Admin User',
    action: 'User suspended',
    target: 'sarah.wilson@example.com',
    timestamp: '2024-01-19T10:15:00Z',
    details: 'User account suspended due to policy violation'
  }
];

// Mock Analytics
export const mockAnalytics: Analytics = {
  totalSales: 148,
  totalRevenue: 15528.52,
  activeUsers: 4,
  totalUsers: 5,
  monthlyRevenue: 12599.99,
  workflowCategories: [
    { category: 'E-commerce', count: 1, revenue: 4499.55 },
    { category: 'Social Media', count: 1, revenue: 2559.68 },
    { category: 'Analytics', count: 1, revenue: 2699.82 },
    { category: 'Customer Service', count: 1, revenue: 3249.75 },
    { category: 'Marketing', count: 1, revenue: 2519.72 }
  ],
  topWorkflows: [
    { id: '1', title: 'E-commerce Automation', sales: 45, revenue: 4499.55 },
    { id: '4', title: 'Customer Support Bot', sales: 25, revenue: 3249.75 },
    { id: '3', title: 'Data Analytics Pipeline', sales: 18, revenue: 2699.82 },
    { id: '2', title: 'Social Media Manager', sales: 32, revenue: 2559.68 }
  ],
  revenueChart: [
    { date: '2024-01-01', revenue: 0 },
    { date: '2024-01-02', revenue: 199.98 },
    { date: '2024-01-03', revenue: 399.96 },
    { date: '2024-01-04', revenue: 599.94 },
    { date: '2024-01-05', revenue: 799.92 },
    { date: '2024-01-06', revenue: 999.90 },
    { date: '2024-01-07', revenue: 1199.88 },
    { date: '2024-01-08', revenue: 1399.86 },
    { date: '2024-01-09', revenue: 1599.84 },
    { date: '2024-01-10', revenue: 1799.82 },
    { date: '2024-01-11', revenue: 1999.80 },
    { date: '2024-01-12', revenue: 2199.78 },
    { date: '2024-01-13', revenue: 2399.76 },
    { date: '2024-01-14', revenue: 2599.74 },
    { date: '2024-01-15', revenue: 2799.72 },
    { date: '2024-01-16', revenue: 2999.70 },
    { date: '2024-01-17', revenue: 3199.68 },
    { date: '2024-01-18', revenue: 3399.66 },
    { date: '2024-01-19', revenue: 3599.64 },
    { date: '2024-01-20', revenue: 3799.62 }
  ]
};

// Mock Settings
export const mockSettings: Settings = {
  storage: {
    maxFileSize: 10, // MB
    allowedTypes: ['json', 'txt', 'csv'],
    storageProvider: 'aws',
    awsConfig: {
      bucket: 'usitech-workflows',
      region: 'us-east-1',
      accessKey: 'AKIAIOSFODNN7EXAMPLE'
    }
  },
  stripe: {
    publishableKey: 'pk_test_51234567890abcdef',
    secretKey: 'sk_test_51234567890abcdef',
    webhookSecret: 'whsec_1234567890abcdef',
    enabled: true
  },
  maintenance: {
    maintenanceMode: false,
    maintenanceMessage: 'System is currently under maintenance. Please try again later.',
    allowedIPs: ['192.168.1.1', '10.0.0.1']
  },
  notifications: {
    emailNotifications: true,
    slackWebhook: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
    discordWebhook: 'https://discord.com/api/webhooks/123456789012345678/abcdefghijklmnopqrstuvwxyz',
    adminEmails: ['admin@usitech.io.vn', 'support@usitech.io.vn']
  }
};

// Helper functions for data manipulation
export const getUsersByStatus = (status: User['status']) => 
  mockUsers.filter(user => user.status === status);

export const getWorkflowsByCategory = (category: string) => 
  mockWorkflows.filter(workflow => workflow.category === category);

export const getPurchasesByStatus = (status: Purchase['status']) => 
  mockPurchases.filter(purchase => purchase.status === status);

export const getRecentActivities = (limit: number = 5) => 
  mockActivities.slice(0, limit);

export const getRecentPurchases = (limit: number = 5) => 
  mockPurchases.slice(0, limit).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const getTopWorkflows = (limit: number = 5) => 
  mockWorkflows
    .filter(w => w.status === 'published')
    .sort((a, b) => b.sales - a.sales)
    .slice(0, limit);
