"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserPlus, Trash2, Key, Users, Shield, Ban } from "lucide-react";
import { useState } from "react";
import { useAlert } from "@/contexts/AlertContext";

// Mock user data
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "ADMIN",
    created_at: "2024-01-10T10:30:00Z",
    is_banned: false
  },
  {
    id: "2", 
    name: "Jane Smith",
    email: "jane@example.com",
    role: "ADMIN",
    created_at: "2024-01-12T09:15:00Z",
    is_banned: false
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@usitech.io.vn",
    role: "ADMIN",
    created_at: "2024-01-01T00:00:00Z",
    is_banned: false
  }
];

export default function SettingsPage() {
  const { showSuccess, showError } = useAlert();
  const [users, setUsers] = useState(mockUsers);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [changePassword, setChangePassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [adminPassword, setAdminPassword] = useState("");

  const handleCreateAdmin = () => {
    if (newAdmin.password !== newAdmin.confirmPassword) {
      showError("Validation Error", "Passwords do not match!");
      return;
    }

    const admin = {
      id: Date.now().toString(),
      name: newAdmin.name,
      email: newAdmin.email,
      role: "ADMIN",
      created_at: new Date().toISOString(),
      is_banned: false
    };

    setUsers([...users, admin]);
    setNewAdmin({ name: "", email: "", password: "", confirmPassword: "" });
    showSuccess("Success", "Admin created successfully!");
  };

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedUser && adminPassword) {
      // In a real app, you'd verify admin password here
      if (adminPassword === "admin123") { // Mock password
        setUsers(users.filter(u => u.id !== selectedUser.id));
        setDeleteDialog(false);
        setSelectedUser(null);
        setAdminPassword("");
        showSuccess("Success", "Admin deleted successfully!");
      } else {
        showError("Authentication Error", "Invalid admin password!");
      }
    } else if (!adminPassword) {
      showError("Validation Error", "Please enter your admin password!");
    }
  };

  const handleChangePassword = () => {
    if (changePassword.newPassword !== changePassword.confirmPassword) {
      showError("Validation Error", "New passwords do not match!");
      return;
    }
    
    // In a real app, you'd make an API call here
    console.log("Changing password...");
    setChangePassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
    showSuccess("Success", "Password changed successfully!");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Management"
        description="Manage admin accounts and user access control"
      />

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="users" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 transition-all duration-200"
          >
            <Users className="h-4 w-4" />
            Manage Users
          </TabsTrigger>
          <TabsTrigger 
            value="create" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 transition-all duration-200"
          >
            <UserPlus className="h-4 w-4" />
            Create Admin
          </TabsTrigger>
          <TabsTrigger 
            value="password" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 transition-all duration-200"
          >
            <Key className="h-4 w-4" />
            Change Password
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
              <CardDescription>Manage existing user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{user.name}</h4>
                         
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                        className="hover:bg-red-700 hover:shadow-lg transition-all duration-200 hover:scale-105 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Admin</CardTitle>
              <CardDescription>Add a new admin account to the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                    placeholder="Admin Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    placeholder="admin@usitech.io.vn"
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                    placeholder="Enter password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={newAdmin.confirmPassword}
                    onChange={(e) => setNewAdmin({...newAdmin, confirmPassword: e.target.value})}
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleCreateAdmin} className="btn-gradient">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Admin
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your admin account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={changePassword.currentPassword}
                  onChange={(e) => setChangePassword({...changePassword, currentPassword: e.target.value})}
                  placeholder="Enter current password"
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={changePassword.newPassword}
                    onChange={(e) => setChangePassword({...changePassword, newPassword: e.target.value})}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    value={changePassword.confirmPassword}
                    onChange={(e) => setChangePassword({...changePassword, confirmPassword: e.target.value})}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleChangePassword} className="btn-gradient">
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Admin Confirmation Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white border shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-lg font-semibold">Delete Admin Account</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete "{selectedUser?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="adminPassword" className="text-gray-700 font-medium">
                Admin Password
              </Label>
              <Input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter your admin password"
                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setDeleteDialog(false);
                setAdminPassword("");
              }}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
