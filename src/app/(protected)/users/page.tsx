import { PageHeader } from "@/components/ui/PageHeader";
import { UserSummaryCard } from "@/components/users/UserSummaryCard";
import { UserTable } from "@/components/users/UserTable";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage user accounts and track user activity"
      />

      <UserSummaryCard />
      <UserTable />
    </div>
  );
}
