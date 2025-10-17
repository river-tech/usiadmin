"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Check, X, AlertCircle, Info, CheckCircle, Search } from "lucide-react";
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

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "SUCCESS":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "ERROR":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case "WARNING":
      return <Info className="h-5 w-5 text-yellow-500" />;
    default:
      return <Bell className="h-5 w-5 text-blue-500" />;
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
      return "bg-blue-100 text-blue-800";
  }
};

export default function NotificationsPage() {
  const { showSuccess, showError } = useAlert();
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationFilter, setNotificationFilter] = useState("all");
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const unreadCount = notifications.filter(n => n.is_unread).length;
  
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = notificationFilter === "all" || notification.type === notificationFilter;
    return matchesSearch && matchesFilter;
  });

  const handleMarkAllRead = () => {
    try {
      setNotifications(notifications.map(n => ({ ...n, is_unread: false })));
      showSuccess("Success", "All notifications marked as read!");
    } catch (error) {
      showError("Error", "Failed to mark notifications as read. Please try again.");
    }
  };

  const handleMarkAsRead = (item: any) => {
    try {
      setNotifications(notifications.map(n => 
        n.id === item.id ? { ...n, is_unread: false } : n
      ));
      // Silent success - no alert for click to read
    } catch (error) {
      showError("Error", "Failed to mark notification as read. Please try again.");
    }
  };

  const handleDismissNotification = (item: any) => {
    try {
      setNotifications(notifications.filter(n => n.id !== item.id));
      showSuccess("Success", "Notification dismissed successfully!");
    } catch (error) {
      showError("Error", "Failed to dismiss notification. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={`You have ${unreadCount} unread notifications`}
        children={
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        }
      />

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={notificationFilter}
          onChange={(e) => setNotificationFilter(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm outline-none focus:outline-none focus:ring-0"
        >
          <option value="all">All Types</option>
          <option value="SUCCESS">Success</option>
          <option value="ERROR">Errors</option>
          <option value="WARNING">Warning</option>
        </select>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`transition-all hover:shadow-md cursor-pointer ${
              notification.is_unread ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
            }`}
            onClick={() => {
              if (notification.is_unread) {
                handleMarkAsRead(notification);
              }
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">
                        {notification.title}
                      </CardTitle>
                      {notification.is_unread && (
                        <Badge className={`text-xs ${getNotificationBadgeColor(notification.type)}`}>
                          New
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mt-1">
                      {notification.message}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-end">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handleDismissNotification(notification);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredNotifications.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
              <p className="text-muted-foreground text-center">
                No notifications match your current search criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}