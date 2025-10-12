"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Check, X, AlertCircle, Info, CheckCircle, Search, Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useAlert } from "@/contexts/AlertContext";

// Mock notification data
const mockNotifications = [
  {
    id: "1",
    title: "New Purchase Completed",
    message: "John Doe purchased 'E-commerce Automation' workflow for $99.99",
    type: "SUCCESS",
    is_unread: false,
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: "2", 
    title: "Workflow Upload Failed",
    message: "Failed to upload 'CRM Integration' workflow. Please check the JSON format.",
    type: "ERROR",
    is_unread: false,
    created_at: "2024-01-15T09:15:00Z"
  },
  {
    id: "3",
    title: "System Maintenance Scheduled",
    message: "Scheduled maintenance will occur on January 20th from 2:00 AM to 4:00 AM UTC.",
    type: "WARNING",
    is_unread: true,
    created_at: "2024-01-14T16:45:00Z"
  },
  {
    id: "4",
    title: "New User Registration",
    message: "Sarah Wilson registered for an account and is awaiting approval.",
    type: "WARNING",
    is_unread: true,
    created_at: "2024-01-14T14:20:00Z"
  },
  {
    id: "5",
    title: "Payment Issue Resolved",
    message: "Payment issue for transaction #TXN-789 has been successfully resolved.",
    type: "SUCCESS",
    is_unread: true,
    created_at: "2024-01-14T11:30:00Z"
  }
];

// Mock logs data
const mockLogs = [
  {
    id: "1",
    admin: "Admin User",
    action: "Created Workflow",
    target: "E-commerce Automation",
    details: "Workflow created with ID: WF-001",
    timestamp: "2024-01-15T10:30:00Z",
    type: "create"
  },
  {
    id: "2",
    admin: "Admin User", 
    action: "Updated User",
    target: "john.doe@example.com",
    details: "Changed user status from pending to active",
    timestamp: "2024-01-15T09:15:00Z",
    type: "update"
  },
  {
    id: "3",
    admin: "System",
    action: "System Error",
    target: "Payment Gateway",
    details: "Payment processing failed for transaction TXN-789",
    timestamp: "2024-01-15T08:45:00Z",
    type: "error"
  },
  {
    id: "4",
    admin: "Admin User",
    action: "Deleted Workflow",
    target: "Old CRM Integration",
    details: "Workflow permanently deleted from system",
    timestamp: "2024-01-14T16:20:00Z",
    type: "delete"
  },
  {
    id: "5",
    admin: "Admin User",
    action: "Approved Purchase",
    target: "Purchase #PUR-456",
    details: "Purchase approved and payment processed",
    timestamp: "2024-01-14T14:10:00Z",
    type: "approve"
  },
  {
    id: "6",
    admin: "System",
    action: "Backup Completed",
    target: "Database",
    details: "Daily backup completed successfully",
    timestamp: "2024-01-14T02:00:00Z",
    type: "system"
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "SUCCESS":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "ERROR":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case "WARNING":
      return <Info className="h-5 w-5 text-yellow-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

const getNotificationBadgeColor = (type: string) => {
  switch (type) {
    case "SUCCESS":
      return "bg-green-100 text-green-800";
    case "ERROR":
      return "bg-red-100 text-red-800";
    case "WARNING":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getLogIcon = (type: string) => {
  switch (type) {
    case "create":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "update":
      return <Info className="h-4 w-4 text-blue-500" />;
    case "delete":
      return <X className="h-4 w-4 text-red-500" />;
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "approve":
      return <Check className="h-4 w-4 text-green-500" />;
    case "system":
      return <Bell className="h-4 w-4 text-gray-500" />;
    default:
      return <Info className="h-4 w-4 text-gray-500" />;
  }
};

const getLogBadgeColor = (type: string) => {
  switch (type) {
    case "create":
      return "bg-green-100 text-green-800";
    case "update":
      return "bg-blue-100 text-blue-800";
    case "delete":
      return "bg-red-100 text-red-800";
    case "error":
      return "bg-red-100 text-red-800";
    case "approve":
      return "bg-green-100 text-green-800";
    case "system":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function NotificationsPage() {
  const { showSuccess, showError } = useAlert();
  const [searchTerm, setSearchTerm] = useState("");
  const [logFilter, setLogFilter] = useState("all");
  const unreadCount = mockNotifications.filter(n => n.is_unread).length;
  
  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = logFilter === "all" || log.type === logFilter;
    return matchesSearch && matchesFilter;
  });

  // Combine notifications and logs into one list
  const allItems = [
    ...mockNotifications.map(n => ({ ...n, itemType: 'notification' })),
    ...filteredLogs.map(l => ({ ...l, itemType: 'log' }))
  ].sort((a, b) => new Date(b.created_at || b.timestamp).getTime() - new Date(a.created_at || a.timestamp).getTime());

  const handleMarkAllRead = () => {
    try {
      // In a real app, you'd make an API call here
      showSuccess("Success", "All notifications marked as read!");
    } catch (error) {
      showError("Error", "Failed to mark notifications as read. Please try again.");
    }
  };

  const handleExportAll = () => {
    try {
      // In a real app, you'd generate and download a file
      showSuccess("Success", "Export completed! Download will start shortly.");
    } catch (error) {
      showError("Error", "Failed to export data. Please try again.");
    }
  };

  const handleMarkAsRead = (item: any) => {
    try {
      // In a real app, you'd make an API call here
      showSuccess("Success", "Notification marked as read!");
    } catch (error) {
      showError("Error", "Failed to mark notification as read. Please try again.");
    }
  };

  const handleDismissNotification = (item: any) => {
    try {
      // In a real app, you'd make an API call here
      showSuccess("Success", "Notification dismissed!");
    } catch (error) {
      showError("Error", "Failed to dismiss notification. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications & Logs"
        description={`You have ${unreadCount} unread notifications`}
        children={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportAll}>
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        }
      />

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications and logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={logFilter}
          onChange={(e) => setLogFilter(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm outline-none focus:outline-none focus:ring-0"
        >
          <option value="all">All Types</option>
          <option value="SUCCESS">Success</option>
          <option value="ERROR">Errors</option>
          <option value="WARNING">Warning</option>
          <option value="create">Created</option>
          <option value="update">Updated</option>
          <option value="delete">Deleted</option>
          <option value="approve">Approved</option>
          <option value="system">System</option>
        </select>
      </div>

      {/* Combined List */}
      <div className="space-y-4">
        {allItems.map((item) => (
          <Card 
            key={`${item.itemType}-${item.id}`} 
            className={`transition-all hover:shadow-md ${
              item.itemType === 'notification' && item.is_unread ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {item.itemType === 'notification' 
                    ? getNotificationIcon(item.type)
                    : getLogIcon(item.type)
                  }
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">
                        {item.itemType === 'notification' ? item.title : item.action}
                      </CardTitle>
                      {item.itemType === 'notification' && item.is_unread && (
                        <Badge className={`text-xs ${getNotificationBadgeColor(item.type)}`}>
                          New
                        </Badge>
                      )}
                      {item.itemType === 'log' && (
                        <Badge className={`text-xs ${getLogBadgeColor(item.type)}`}>
                          {item.type}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mt-1">
                      {item.itemType === 'notification' 
                        ? item.message 
                        : `${item.admin} • ${item.target}`
                      }
                    </CardDescription>
                    {item.itemType === 'log' && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.details}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.created_at || item.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-end">
                <div className="flex items-center space-x-2">
                  {item.itemType === 'notification' && item.is_unread && (
                    <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(item)}>
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => handleDismissNotification(item)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {allItems.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground text-center">
              No notifications or logs match your current search criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
