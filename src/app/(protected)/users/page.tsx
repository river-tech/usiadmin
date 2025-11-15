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
    dispatch(fetchUsers());
    dispatch(fetchUsersOverview());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage user accounts and track user activity"
      />

      <UserSummaryCard overview={overview || {
total_users: 0,
active_users: 0,
total_purchases: 0,
total_spent: 0
      }} />
      <UserTable users={users} />
    </div>
  );
}
