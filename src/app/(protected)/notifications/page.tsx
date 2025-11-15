"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Check, X, AlertCircle, Info, CheckCircle, Search, Trash2 } from "lucide-react";
import { useAlert } from "@/contexts/AlertContext";
import {
  fetchNotifications,
  markAllNotificationsReadThunk,
  markNotificationReadThunk,
  deleteNotificationThunk,
  deleteAllNotificationsThunk,
  broadcastNotificationThunk,
} from "@/feature/notificationSlide";
import { AdminNotification, AdminNotificationType } from "@/lib/types";
import { RootState } from "@/store";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

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
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useAlert();
  const [type, setType] = useState<AdminNotificationType>("SUCCESS");
  const {list, total, isLoading} = useAppSelector((state: RootState) => state.notification);
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationFilter, setNotificationFilter] = useState("all");
  const [isSendingNotificationToAllUsers, setIsSendingNotificationToAllUsers] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
   console.log(list)
  }, [list]);

  // Filtering, searching
  const filteredNotifications = list.filter((notification: AdminNotification) => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = notificationFilter === "all" || notification.type === notificationFilter;
    return matchesSearch && matchesFilter;
  });

  const handleMarkAllRead = async () => {
    try {
      await dispatch(markAllNotificationsReadThunk()).unwrap();
      showSuccess("Success", "All notifications marked as read!");
      dispatch(fetchNotifications());
    } catch {
      showError("Error", "Failed to mark notifications as read. Please try again.");
    }
  };

  const handleDeleteAll = async () => {
    try {
      const result = await dispatch(deleteAllNotificationsThunk()).unwrap();
      showSuccess("Success", result.message || "All notifications deleted successfully!");
      dispatch(fetchNotifications());
      setShowDeleteAllConfirm(false);
    } catch {
      showError("Error", "Failed to delete all notifications. Please try again.");
    }
  };

  const handleMarkAsRead = async (notification: AdminNotification) => {
    if (!notification.is_unread) return;
    try {
      await dispatch(markNotificationReadThunk(notification.id)).unwrap();
      // Optionally refresh list
      dispatch(fetchNotifications());
    } catch {
      showError("Error", "Failed to mark notification as read. Please try again.");
    }
  };

  const handleDismissNotification = async (notification: AdminNotification) => {
    try {
      await dispatch(deleteNotificationThunk(notification.id)).unwrap();
      showSuccess("Success", "Notification dismissed successfully!");
      dispatch(fetchNotifications());
    } catch {
      showError("Error", "Failed to dismiss notification. Please try again.");
    }
  };
  const handleSendNotificationToAllUsers = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;
    const message = formData.get("message") as string;
    const type = formData.get("type") as string;
    const result = await dispatch(broadcastNotificationThunk({title, message, type}))
    if(result) {
      showSuccess("Success", "Notification sent to all users successfully!");
      dispatch(fetchNotifications());
      setIsSendingNotificationToAllUsers(false);
    } else {
      showError("Error", "Failed to send notification. Please try again.");
    }
    
  };

  const getSelectBorderColor = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return "border-green-400 focus:ring-green-100";
      case "WARNING":
        return "border-yellow-400 focus:ring-yellow-100";
      case "ERROR":
        return "border-red-400 focus:ring-red-100";
      default:
        return "border-gray-300 focus:ring-blue-100";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={`You have ${total} unread notifications`}
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={isLoading || list.length === 0}>
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowDeleteAllConfirm(true)} 
            disabled={isLoading || list.length === 0}
            className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete All
          </Button>
        </div>
      </PageHeader>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        
          <Input
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        <div>
          <Button className="hover:bg-green-100 hover:border-gray-300 transition-all duration-200 hover:shadow-sm cursor-pointer" variant="default" size="sm" onClick={() => setIsSendingNotificationToAllUsers(true)}>
            Send Notification to All Users
          </Button>
        </div>
        <select
          value={notificationFilter}
          onChange={(e) => setNotificationFilter(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm outline-none focus:outline-none focus:ring-0"
          disabled={isLoading}
        >
          <option value="all">All Types</option>
          <option value="SUCCESS">Success</option>
          <option value="ERROR">Errors</option>
          <option value="WARNING">Warning</option>
        </select>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="animate-pulse h-24">
              <CardHeader className="pb-2"><div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div></CardHeader>
              <CardContent><div className="h-3 bg-gray-100 rounded w-1/2"></div></CardContent>
            </Card>
          ))
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all hover:shadow-md cursor-pointer ${notification.is_unread ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''}`}
              onClick={() => handleMarkAsRead(notification)}
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
                          <Badge className={`text-xs ${getNotificationBadgeColor(notification.type)}`}>New</Badge>
                        )}
                      </div>
                      <CardDescription className="mt-1">
                        {notification.message}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {/* {formatDistanceToNow(new Date(notification.), { addSuffix: true })} */}
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
                      onClick={e => {
                        e.stopPropagation();
                        handleDismissNotification(notification);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
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
      {
          isSendingNotificationToAllUsers && (
            // Modal for sending notification to all users
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
              <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 w-full max-w-lg mx-auto border border-slate-200 relative animate-fadein">
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-blue-500 p-2 rounded-full shadow-lg flex items-center justify-center">
                  <Bell className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-extrabold text-blue-500 mb-6 text-center tracking-tight drop-shadow-sm">
                  Send Notification to All Users
                </h3>
                <form
                  className="space-y-6"
                  onSubmit={handleSendNotificationToAllUsers}
                >
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="notif-title">
                      Title <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="notif-title"
                        name="title"
                        required
                        className="w-full rounded-lg border-2 border-blue-200 px-4 py-2  text-base shadow-inner transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-slate-400"
                        type="text"
                        placeholder="Enter a title..."
                        autoComplete="off"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 pointer-events-none">
                        <Info className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="notif-type">
                      Type <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="notif-type"
                        name="type"
                        required
                        onChange={(e) => setType(e.target.value)}
                        defaultValue="SUCCESS"
                        className={`w-full rounded-lg border-2 appearance-none pr-10 border-blue-200 focus:border-blue-400 px-4 py-2 text-base shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer ${getSelectBorderColor(type)} font-semibold transition`}
                       
                      >
                        <option className="bg-green-50 text-green-700 font-bold" value="SUCCESS">Success</option>
                        <option className="bg-yellow-50 text-yellow-900 font-bold" value="WARNING">Warning</option>
                        <option className="bg-red-50 text-red-700 font-bold" value="ERROR">Error</option>
                      </select>
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-blue-400">
                        <Bell className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="notif-message">
                      Message <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      id="notif-message"
                      name="message"
                      required
                      rows={4}
                      className="w-full rounded-lg border-2 border-blue-200 focus:border-blue-400 px-4 py-2 text-base resize-none shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-slate-400"
                      placeholder="Enter message content..."
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-5">
                    <Button
                      className="transition-all duration-200 hover:scale-105 bg-gradient-to-tr from-gray-200 to-gray-100 border-none text-gray-700 hover:bg-gray-300 font-semibold rounded-lg shadow-sm"
                      variant="ghost"
                      onClick={() => setIsSendingNotificationToAllUsers(false)}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="transition-all duration-200 hover:scale-105 text-black border-none font-semibold rounded-lg shadow-lg hover:shadow-xl"
                      type="submit"
                      variant="default"
                    >
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4" /> Send Notification
                      </span>
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )
      }

      {/* Confirm Delete All Dialog */}
      <ConfirmDialog
        open={showDeleteAllConfirm}
        onOpenChange={setShowDeleteAllConfirm}
        title="Delete All Notifications"
        description={`Are you sure you want to delete all ${list.length} notifications? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDeleteAll}
      />
    </div>
    
  );
}
