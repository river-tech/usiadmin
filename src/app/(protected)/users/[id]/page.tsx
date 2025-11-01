"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Mail,
  Calendar,
  DollarSign,
  ShoppingBag,
  User as UserIcon,
  TrendingUp,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAlert } from "@/contexts/AlertContext";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store";
import {
  fetchUserDetail,
  clearSelectedUser,
  selectSelectedUser,
} from "@/feature/userSlide";
import type { UserDetail, UserPurchase } from "@/lib/types";
import { formatCurrencyVND } from "@/lib/utils";

// (Optional) You'd need a real API for purchase history if you want it live.
// Here, we'll simulate purchase history on the user.detail for demo purposes:


export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { showError } = useAlert();
  const dispatch: AppDispatch = useDispatch();

  const user = useSelector(selectSelectedUser);
  const loading = useSelector((state: any) => state.users.isLoading);
  const error = useSelector((state: any) => state.users.error);

  // For demo, simulate some purchase history if user is loaded.
  // Replace with actual user.purchase_history when integrated with the API.
  const userPurchases: UserPurchase[] = user
    ? user.purchase_history
        : [];
        

  const mapPurchaseStatusToBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "completed" || s === "success" || s === "active") return "SUCCESS" as const;
    if (s === "failed" || s === "error" || s === "reject" || s === "rejected") return "ERROR" as const;
    return "PENDING" as const;
  };

  useEffect(() => {
    if (!params.id) return;
    const userId = params.id as string;
    dispatch(fetchUserDetail(userId))
      .unwrap()
      .catch((err: any) => {
        showError("Error", "User not found!");
        router.push("/users");
      });

    return () => {
      dispatch(clearSelectedUser());
    };
  }, [params.id, dispatch, router, showError]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="User Not Found"
          description="The requested user could not be found"
        />
      </div>
    );
  }

  // These stats are simulated
  const totalSpent = userPurchases.reduce((sum, purchase) => sum + purchase.price, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Profile"
        description={`Viewing profile for ${user.name}`}
        children={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 hover:shadow-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        }
      />

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar_url} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                {/* <StatusBadge />  */}
              </div>
              <CardDescription className="text-base">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Joined{" "}
                  {formatDistanceToNow(new Date(user.joined_at), { addSuffix: true })}
                </div>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Purchases</p>
                <p className="text-2xl font-bold">{userPurchases.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">{formatCurrencyVND(totalSpent)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <UserIcon className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="text-2xl font-bold capitalize">{user.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Order</p>
                <p className="text-2xl font-bold">
                  $
                  {userPurchases.length > 0
                    ? (totalSpent / userPurchases.length).toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase History Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold">Purchase History</h2>
        </div>
        {userPurchases.length > 0 ? (
          <div className="space-y-4">
            {userPurchases.map((purchase) => (
              <Card key={purchase.workflow_id} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{purchase.workflow_title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(purchase.purchased_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-semibold">${purchase.price.toFixed(2)}</p>
                      <StatusBadge status={mapPurchaseStatusToBadge(purchase.status)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No purchases found</h3>
              <p className="text-muted-foreground text-center">
                This user hasn't made any purchases yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
