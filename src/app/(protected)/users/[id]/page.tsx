"use client";

import { useState, useEffect } from "react";
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
  User,
  TrendingUp,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { mockUsers } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAlert } from "@/contexts/AlertContext";

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  status: string;
  is_banned: boolean;
  joinDate: string;
  purchases: number;
  totalSpent: number;
}

interface Purchase {
  id: string;
  user_id: string;
  workflow_title: string;
  amount: number;
  status: string;
  created_at: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { showSuccess, showError } = useAlert();
  const [user, setUser] = useState<User | null>(null);
  const [userPurchases, setUserPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  const mapPurchaseStatusToBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "completed" || s === "success" || s === "active") return "SUCCESS" as const;
    if (s === "failed" || s === "error" || s === "reject" || s === "rejected") return "ERROR" as const;
    return "PENDING" as const;
  };

  useEffect(() => {
    // Simulate API call
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userId = params.id as string;
        
        // Find user from mock data
        const foundUser = mockUsers.find(u => u.id === userId);
        if (!foundUser) {
          showError("Error", "User not found!");
          router.push("/users");
          return;
        }

        // Find user's purchases and add more sample data
        // const purchases = mockPurchases.filter(p => p.user_id === userId);
        
        // Add additional sample purchase history
        const additionalPurchases: Purchase[] = [
          {
            id: `${userId}-purchase-1`,
            user_id: userId,
            workflow_title: "Advanced Data Analytics Workflow",
            amount: 299.99,
            status: "completed",
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: `${userId}-purchase-2`,
            user_id: userId,
            workflow_title: "Machine Learning Pipeline",
            amount: 149.50,
            status: "completed",
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: `${userId}-purchase-3`,
            user_id: userId,
            workflow_title: "API Integration Suite",
            amount: 89.99,
            status: "pending",
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: `${userId}-purchase-4`,
            user_id: userId,
            workflow_title: "Database Optimization Tools",
            amount: 199.00,
            status: "completed",
            created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: `${userId}-purchase-5`,
            user_id: userId,
            workflow_title: "Cloud Migration Workflow",
            amount: 399.99,
            status: "failed",
            created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        const allPurchases = [...additionalPurchases];
        
        setUser(foundUser as unknown as User);
        setUserPurchases(allPurchases);
      } catch (error) {
        showError("Error", "Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [params.id, router, showError]);

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

  const totalSpent = userPurchases.reduce((sum, purchase) => sum + purchase.amount, 0);
  const lastPurchase = userPurchases.length > 0 ? userPurchases[0] : null;

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
                {user.name.split(' ').map(n => n[0]).join('')}
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
                  Joined {formatDistanceToNow(new Date(user.joinDate), { addSuffix: true })}
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
                <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-purple-500" />
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
                  ${userPurchases.length > 0 ? (totalSpent / userPurchases.length).toFixed(2) : '0.00'}
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
                <Card key={purchase.id} className="hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{purchase.workflow_title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(purchase.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-semibold">${purchase.amount.toFixed(2)}</p>
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
