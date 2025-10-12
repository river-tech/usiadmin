import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this resource.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              This is a secure admin portal. If you believe you should have access, 
              please contact your system administrator.
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
              <span>IP Restricted</span>
              <span>•</span>
              <span>2FA Required</span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link href="/login">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Need help? Contact support at{" "}
              <a 
                href="mailto:support@usitech.io.vn" 
                className="text-primary hover:underline"
              >
                support@usitech.io.vn
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
