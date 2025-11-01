'use client';
import { StatCard } from "@/components/ui/StatCard";
import { Workflow, DollarSign, TrendingUp, Users } from "lucide-react";
import { formatCurrencyVND } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";
import { fetchWorkflowOverview } from "@/feature/workflowSlide";
import { useEffect } from "react";

export function WorkflowStats() {
  const {  overview } = useAppSelector((state: RootState) => state.workflows);
  const dispatch = useAppDispatch();
  useEffect(() => {
   dispatch(fetchWorkflowOverview());
  }, [dispatch]);

  const stats = [
    {
      title: "Total Workflows",
      value: overview?.total_workflows || 0,
      icon: <Workflow className="h-4 w-4" />,
      description: "All workflows in system"
    },
    {
      title: "Active",
      value: overview?.active_workflows || 0,
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Currently active"
    },
    {
      title: "Total Sales",
      value: overview?.total_sales || 0,
      icon: <Users className="h-4 w-4" />,
      description: "All-time sales count"
    },
    {
      title: "Total Revenue",
      value: formatCurrencyVND(overview?.total_revenue || 0),
      icon: <DollarSign className="h-4 w-4" />,
      description: "All-time revenue generated"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          description={stat.description}
        />
      ))}
    </div>
  );
}
