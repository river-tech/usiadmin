import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRecentActivities } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";

export function RecentActivity() {
  const activities = getRecentActivities(5);

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
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest actions in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="text-lg">
                {getActivityIcon(activity.action)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">
                    {activity.action}
                  </p>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getActivityColor(activity.action)}`}
                  >
                    {activity.admin}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.target}
                </p>
                {activity.details && (
                  <p className="text-xs text-muted-foreground">
                    {activity.details}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
