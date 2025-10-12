import { PageHeader } from "@/components/ui/PageHeader";
import { PurchaseStats } from "@/components/purchases/PurchaseStats";
import { PurchaseTable } from "@/components/purchases/PurchaseTable";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function PurchasesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchases"
        description="Track all transactions and payment history"
        children={
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        }
      />

      <PurchaseStats />
      <PurchaseTable />
    </div>
  );
}
