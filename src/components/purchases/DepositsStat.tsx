import { StatCard } from "@/components/ui/StatCard";
import { Banknote, CheckCircle, Clock, XCircle, DollarSign } from "lucide-react";
import { formatCurrencyVND } from "@/lib/utils";
import { OverviewDeposit } from "@/lib/types";

export function DepositsStat({ overview }:{ overview: OverviewDeposit | null }) {
  const total = overview?.total || 0;
  const totalAmount = overview?.total_amount || 0;
  const pending = overview?.pending || 0 || 0;
  const completed = overview?.completed || 0 || 0;
  const rejected = overview?.rejected || 0 || 0;
  const stats = [
    {
      title: "Total Deposits",
      value: total,
      icon: <Banknote className="h-4 w-4" />, description: "Total deposits"
    },
    {
      title: "Total Amount",
      value: formatCurrencyVND(totalAmount),
      icon: <DollarSign className="h-4 w-4" />, description: "Total amount of deposits"
    },
    {
      title: "Completed",
      value: completed, icon: <CheckCircle className="h-4 w-4" />, description: "Completed deposits"
    },
    {
      title: "Pending",
      value: pending, icon: <Clock className="h-4 w-4" />, description: "Pending deposits"
    },
    {
      title: "Rejected",
      value: rejected, icon: <XCircle className="h-4 w-4" />, description: "Rejected deposits"
    }
  ];
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
}
