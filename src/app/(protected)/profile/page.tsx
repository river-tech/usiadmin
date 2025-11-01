"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { Shield, Calendar, Edit, Save, X, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";
import { getCurrentUser, updateUserProfile, changePassword } from "@/feature/authSlice";
import { useAlert } from "@/contexts/AlertContext";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state: RootState) => state.auth);
  const [profileData, setProfileData] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const { showSuccess, showError } = useAlert();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) setProfileData(user);
  }, [user]);

  const handleSave = async () => {
    try {
      await dispatch(updateUserProfile({ name: profileData?.name || "" })).unwrap();
      showSuccess("Profile updated", "Your profile has been saved successfully.");
      setIsEditing(false);
    } catch (e: any) {
      showError("Update failed", e?.message || "Could not save your profile.");
    }
  };

  const handleCancel = () => {
    setProfileData(user);
    setIsEditing(false);
  };
  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showError("Validation error", "Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      showError("Validation error", "New password and confirm do not match");
      return;
    }
    try {
      await dispatch(changePassword({ currentPassword, newPassword })).unwrap();
      showSuccess("Password updated", "Your password has been changed.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsEditing(false);
    } catch (e: any) {
      showError("Change failed", e?.detail || "Could not change password.");
    }
  };

  return (
    <motion.div
      className="space-y-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ===== Page Header ===== */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Profile
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage your personal information and account security
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                size="sm"
                className="border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow hover:opacity-90"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* ===== Profile Overview ===== */}
        <Card className="rounded-2xl shadow-lg border border-blue-100 bg-gradient-to-br from-blue-50 to-white transition hover:shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-800">Profile Overview</CardTitle>
            <CardDescription className="text-gray-500">
              Your account summary
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center space-y-4 text-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {profileData?.name || "No Name"}
              </h3>
              <p className="text-sm text-gray-500">{profileData?.email}</p>
            </div>

            <Badge className="rounded-full px-3 py-1 bg-blue-100 text-blue-700 shadow-sm">
              <Shield className="h-3 w-3 mr-1" />
              {profileData?.role || "User"}
            </Badge>

            <div className="flex flex-col items-center text-sm text-gray-500 mt-2">
              <Calendar className="w-4 h-4 mr-1 inline-block text-blue-500" />
              Member since:{" "}
              <span className="text-gray-700">
                {profileData?.created_at
                  ? new Date(profileData.created_at).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* ===== Account Details ===== */}
        <Card className="lg:col-span-2 rounded-2xl shadow-lg border border-blue-100 bg-white hover:shadow-xl transition">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl pb-3">
            <CardTitle className="text-gray-800 font-semibold">Account Details</CardTitle>
            <CardDescription className="text-gray-500">
              Update your personal information
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  Full Name
                </Label>
                <input
                  type="text"
                  id="name"
                  value={profileData?.name || ""}
                  onChange={(e) =>
                    setProfileData(profileData ? { ...profileData, name: e.target.value } : null)
                  }
                  disabled={!isEditing}
                  className={`w-full rounded-lg border px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                    !isEditing
                      ? "bg-gray-50 text-gray-700 border-gray-200"
                      : "border-blue-300"
                  }`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <input
                  type="email"
                  id="email"
                  value={profileData?.email || ""}
                  readOnly
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 text-gray-700 px-3 py-2 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Role</Label>
                <div className="flex items-center space-x-2">
                  <Badge className="rounded-full px-3 py-1 bg-blue-50 text-blue-700">
                    <Shield className="h-3 w-3 mr-1 text-blue-500" />
                    {profileData?.role || "User"}
                  </Badge>
                  <span className="text-sm text-gray-400">Cannot be changed</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Joined</Label>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">
                    {profileData?.created_at
                      ? new Date(profileData.created_at).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== Security Settings (Change Password Full Width) ===== */}
      <div className="mt-8">
        <Card className="rounded-2xl shadow-lg border border-blue-100 bg-gradient-to-br from-blue-50 to-white hover:shadow-xl transition w-full">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl pb-3">
            <CardTitle className="text-gray-800 font-semibold">Security Settings</CardTitle>
            <CardDescription className="text-gray-500">
              Manage your account password
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4 w-full">
            <div className="space-y-4 w-full">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-gray-700 font-medium">
                  Current Password
                </Label>
                <input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter your current password"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 transition"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-700 font-medium">
                  New Password
                </Label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="Enter a new password"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 transition"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                  Confirm New Password
                </Label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your new password"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 transition"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white rounded-lg px-6 py-2 font-medium shadow"
                  onClick={handleUpdatePassword}
                >
                  Update Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}