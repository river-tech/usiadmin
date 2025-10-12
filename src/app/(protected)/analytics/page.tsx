// Analytics page - temporarily disabled for future development
// import { PageHeader } from "@/components/ui/PageHeader";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { StatCard } from "@/components/ui/StatCard";
// import { Badge } from "@/components/ui/badge";
// import { mockAnalytics } from "@/lib/mock-data";
// import { DollarSign, TrendingUp, Users, BarChart3 } from "lucide-react";

// export default function AnalyticsPage() {
//   const analytics = mockAnalytics;

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Analytics"
//         description="Comprehensive analytics and insights for your workflows"
//       />

//       {/* Key Metrics */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <StatCard
//           title="Total Revenue"
//           value={`$${analytics.totalRevenue.toLocaleString()}`}
//           icon={<DollarSign className="h-4 w-4" />}
//           description="All-time revenue"
//         />
//         <StatCard
//           title="Total Sales"
//           value={analytics.totalSales}
//           icon={<BarChart3 className="h-4 w-4" />}
//           description="All-time sales count"
//         />
//         <StatCard
//           title="Active Users"
//           value={analytics.activeUsers}
//           icon={<Users className="h-4 w-4" />}
//           description="Currently active users"
//         />
//         <StatCard
//           title="Monthly Revenue"
//           value={`$${analytics.monthlyRevenue.toLocaleString()}`}
//           icon={<TrendingUp className="h-4 w-4" />}
//           description="This month's revenue"
//         />
//       </div>

//       {/* Revenue Chart */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Revenue Trends</CardTitle>
//           <CardDescription>
//             Revenue growth over the last 20 days
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="h-[300px] flex items-end justify-between space-x-2">
//             {analytics.revenueChart.slice(-20).map((item, index) => {
//               const maxRevenue = Math.max(...analytics.revenueChart.map(d => d.revenue));
//               const height = (item.revenue / maxRevenue) * 100;
              
//               return (
//                 <div key={index} className="flex flex-col items-center space-y-2 flex-1">
//                   <div
//                     className="w-full bg-gradient-to-t from-primary/80 to-primary/40 rounded-t-sm transition-all duration-300 hover:from-primary to-primary/60"
//                     style={{ height: `${height}%` }}
//                   />
//                   <div className="text-xs text-muted-foreground">
//                     {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric' })}
//                   </div>
//                   <div className="text-xs font-medium">
//                     ${item.revenue.toLocaleString()}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </CardContent>
//       </Card>

//       <div className="grid gap-6 md:grid-cols-2">
//         {/* Workflow Categories */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Workflow Categories</CardTitle>
//             <CardDescription>
//               Revenue distribution by category
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {analytics.workflowCategories.map((category, index) => (
//                 <div key={index} className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <Badge variant="outline">{category.category}</Badge>
//                     <span className="text-sm text-muted-foreground">
//                       {category.count} workflows
//                     </span>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-medium">${category.revenue.toLocaleString()}</p>
//                     <p className="text-xs text-muted-foreground">revenue</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Top Workflows */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Top Selling Workflows</CardTitle>
//             <CardDescription>
//               Best performing workflows by sales
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {analytics.topWorkflows.map((workflow, index) => (
//                 <div key={index} className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
//                       {index + 1}
//                     </div>
//                     <div>
//                       <p className="font-medium">{workflow.title}</p>
//                       <p className="text-sm text-muted-foreground">
//                         {workflow.sales} sales
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-medium">${workflow.revenue.toLocaleString()}</p>
//                     <p className="text-xs text-muted-foreground">revenue</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// Placeholder component for now
export default function AnalyticsPage() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-muted-foreground mb-2">Analytics</h2>
        <p className="text-muted-foreground">Coming soon...</p>
      </div>
    </div>
  );
}
