import { PageHeader } from "@/components/ui/PageHeader";
import { PurchaseStats } from "@/components/purchases/PurchaseStats";
import { PurchaseTable } from "@/components/purchases/PurchaseTable";
import { Button } from "@/components/ui/button";

export default function PurchasesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchases"
        description="Track all transactions and payment history"
      />

      <PurchaseStats />
      <PurchaseTable />
    </div>
  );
}
