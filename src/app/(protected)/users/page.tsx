"use client";

import { useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { UserSummaryCard } from "@/components/users/UserSummaryCard";
import { UserTable } from "@/components/users/UserTable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsers, fetchUsersOverview, selectUsers, selectUsersOverview } from "@/feature/userSlide";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const overview = useAppSelector(selectUsersOverview);

  useEffect(() => {
    dispatch(fetchUsers(undefined as any));
    dispatch(fetchUsersOverview());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage user accounts and track user activity"
      />

      <UserSummaryCard overview={overview} />
      <UserTable users={users} />
    </div>
  );
}
