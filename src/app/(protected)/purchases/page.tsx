"use client";
import { useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PurchaseStats } from "@/components/purchases/PurchaseStats";
import { PurchaseTable } from "@/components/purchases/PurchaseTable";
import { useAppDispatch } from "@/store/hooks";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";
import {  fetchPurchasesList, fetchPurchasesOverview } from "@/feature/purchaseSlide";
import { PurchasesOverview } from "@/lib/types";


export default function PurchasesPage() {
  const dispatch = useAppDispatch();
  const { overview, list, detail, isLoading, error, updateStatusSuccess} = useAppSelector((state: RootState) => state.purchases);
  useEffect(() => {
    dispatch(fetchPurchasesOverview());
    dispatch(fetchPurchasesList());
  }, [dispatch]);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchases"
        description="Track all transactions and payment history"
      />

      <PurchaseStats overview={overview } />
      <PurchaseTable list={list} isLoading={isLoading} />
    </div>
  );
}
