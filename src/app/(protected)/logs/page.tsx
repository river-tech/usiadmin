import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getRecentActivities } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";
import { Download, Filter } from "lucide-react";

export default function LogsPage() {
  const activities = getRecentActivities(20);

  const getActivityIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'published workflow':
        return '🚀';
      case 'user registered':
        return '👤';
      case 'purchase completed':
        return '💰';
      case 'workflow updated':
        return '✏️';
      case 'user suspended':
        return '⚠️';
      default:
        return '📝';
    }
  };

  const getActivityColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'published workflow':
        return 'bg-green-100 text-green-800';
      case 'user registered':
        return 'bg-blue-100 text-blue-800';
      case 'purchase completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'workflow updated':
        return 'bg-orange-100 text-orange-800';
      case 'user suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Logs"
        description="View and monitor system activity and admin actions"
        children={
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search logs..."
          className="w-80"
        />
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Logs Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admin</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {getActivityIcon(activity.action)}
                    </span>
                    <span className="font-medium">{activity.admin}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getActivityColor(activity.action)}`}
                  >
                    {activity.action}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {activity.target}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {activity.details || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
