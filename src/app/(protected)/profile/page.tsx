"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, Calendar, Edit, Save, X } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@usitech.io.vn",
    avatar: "/avatars/admin.jpg",
    role: "ADMIN",
    joinDate: "2024-01-01",
  });

  const handleSave = () => {
    // In a real app, you'd make an API call here
    console.log("Saving profile:", profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your account settings and preferences"
        children={
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel} size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <Card className="lg:col-span-1 rounded-xl border shadow-sm">
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24 ring-2 ring-gray-200">
                <AvatarImage src={profileData.avatar} alt={profileData.name} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg font-semibold">{profileData.name}</h3>
                <p className="text-sm text-muted-foreground">{profileData.email}</p>
                <Badge variant="secondary" className="mt-2 rounded-full px-3 py-1">
                  <Shield className="h-3 w-3 mr-1" />
                  {profileData.role}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Member since:</span>
                <span>{new Date(profileData.joinDate).toLocaleDateString()}</span>
              </div>
              image.png
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2 rounded-xl border shadow-sm">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50 text-gray-700" : undefined}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50 text-gray-700" : undefined}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                value={profileData.avatar}
                onChange={(e) => setProfileData({...profileData, avatar: e.target.value})}
                disabled={!isEditing}
                placeholder="https://example.com/avatar.jpg"
                className={!isEditing ? "bg-gray-50 text-gray-700" : undefined}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Role</Label>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    <Shield className="h-3 w-3 mr-1" />
                    {profileData.role}
                  </Badge>
                  <span className="text-sm text-muted-foreground">Cannot be changed</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Member Since</Label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{new Date(profileData.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card className="rounded-xl border shadow-sm">
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your account security and authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
            <div>
              <h4 className="font-medium">Change Password</h4>
              <p className="text-sm text-muted-foreground">
                Update your password to keep your account secure
              </p>
            </div>
            <Button variant="outline" size="sm" className="rounded-full">
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

