"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import { useAlert } from "@/contexts/AlertContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserDetail } from "@/feature/userSlide";
import { AdminNotificationType } from "@/lib/types";
import { createNotificationThunk } from "@/feature/notificationSlide";

export default function SendNotiPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const selectedUser = useAppSelector((state) => state.users.selectedUser);

  useEffect(() => {
    dispatch(fetchUserDetail(params?.id as string));
    // if(success) {
    //   showSuccess("Notification sent successfully,", "Notification sent successfully");
    // } 
    // if(error) {
    //   showError("Error", error || "Failed to send notification");
    // }
  }, [dispatch, params?.id]);

  const { showSuccess } = useAlert();
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<AdminNotificationType | "">("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Helper to get color for select and option
  const getSeverityColor = (value: string) => {
    switch (value) {
      case "SUCCESS":
        return "bg-green-100 text-green-700";
      case "WARNING":
        return "bg-yellow-100 text-yellow-700";
      case "ERROR":
        return "bg-red-100 text-red-700";
      default:
        return "bg-white text-gray-900";
    }
  };

  // For border color of the <select>
  const getSelectBorderColor = (value: string) => {
    switch (value) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Submitting");
    e.preventDefault();
    if (!title.trim() || !message.trim() || !level) return;
    setSubmitting(true);
    try {
      console.log("Creating notification");
      // TODO: Integrate API call to send notification to user (params.id)
    const res =  await dispatch(createNotificationThunk({
        user_id: params?.id as string,
        title: title,
        message: message,
        type: level as AdminNotificationType,
      }));
      if(res){
        router.back();
        showSuccess("Notification sent successfully,", "Notification sent successfully");
      }
     
    } finally {
      setSubmitting(false);
    }
  };

  const userId = (params?.id as string) || "";

  return (
    <div className="space-y-6 flex flex-col items-center min-h-[80vh] justify-center">
         <div className="flex gap-2 w-full justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 hover:shadow-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
      <PageHeader
        title={<span className="font-bold uppercase">SEND NOTIFICATION</span>}
        description={
          userId
            ? (
                <span>
                  To <span className="font-bold uppercase">{selectedUser?.name ?? ""}</span>
                </span>
              )
            : <span className="font-bold uppercase">SEND A NOTIFICATION TO A USER</span>
        }
      />

      <Card className="max-w-2xl w-full mx-auto">
        <CardHeader>
          <CardTitle>Notification Details</CardTitle>
          <CardDescription>
            Enter a title, severity, and message to send to the user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Notification Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Notification Severity</Label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value as AdminNotificationType)}
                className={`border rounded px-3 py-2 w-full focus:outline-none ${getSelectBorderColor(level)} ${getSeverityColor(level)} transition-all`}
              >
                <option value="" className="bg-white text-gray-800">Select severity</option>
                <option value="SUCCESS" className="bg-green-100 text-green-700">Success</option>
                <option value="WARNING" className="bg-yellow-100 text-yellow-700">Warning</option>
                <option value="ERROR" className="bg-red-100 text-red-700">Error</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Notification Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message..."
                className="min-h-[120px] resize-y"
              />
            </div>
            <div className="flex items-center justify-end">
              <Button
              className="hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 hover:shadow-sm cursor-pointer"
                type="submit"
                disabled={
                  submitting ||
                  !title.trim() ||
                  !message.trim() ||
                  !level
                }
              >
                <Send className="h-4 w-4 mr-2" />
                {submitting ? "Sending..." : "Send Notification"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
