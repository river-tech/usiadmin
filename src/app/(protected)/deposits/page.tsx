"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";
import { PageHeader } from "@/components/ui/PageHeader";
import { DepositsStat } from "@/components/purchases/DepositsStat";
import { DepositTable } from "@/components/purchases/DepositTable";
import { fetchDepositList, fetchDepositOverview } from "@/feature/depositSlide";

export default function DepositsPage() {
  const dispatch = useAppDispatch();
  const { list, overview, isLoading } = useAppSelector((state: RootState) => state.deposits);
  useEffect(() => {
    dispatch(fetchDepositList());
    dispatch(fetchDepositOverview());
  }, [dispatch]);
  return (
    <div className="space-y-6">
      <PageHeader title="Deposits" description="Quản lý các giao dịch nạp tiền của người dùng" />
      <DepositsStat overview={overview}/>
      <DepositTable list={list} isLoading={isLoading} />
    </div>
  );
}
