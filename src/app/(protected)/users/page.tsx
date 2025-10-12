import { PageHeader } from "@/components/ui/PageHeader";
import { UserSummaryCard } from "@/components/users/UserSummaryCard";
import { UserTable } from "@/components/users/UserTable";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage user accounts and track user activity"
        children={
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        }
      />

      <UserSummaryCard />
      <UserTable />
    </div>
  );
}
