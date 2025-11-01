import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'ACTIVE' | 'PENDING' | 'REJECT' | 'expired' | 'SUCCESS' | 'ERROR' | 'WARNING' | 'banned' | 'online' | 'offline';
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

const statusConfig = {
  active: { label: 'Active', className: 'status-active' },
  inactive: { label: 'Inactive', className: 'status-inactive' },
  ACTIVE: { label: 'Completed', className: 'status-completed' },
  PENDING: { label: 'Pending', className: 'status-pending' },
  REJECT: { label: 'Rejected', className: 'status-failed' },
  expired: { label: 'Expired', className: 'status-unpublished' },
  SUCCESS: { label: 'Success', className: 'status-success' },
  ERROR: { label: 'Error', className: 'status-error' },
  WARNING: { label: 'Warning', className: 'status-warning' },
  banned: { label: 'Banned', className: 'status-banned' },
  online: { label: 'Online', className: 'status-online' },
  offline: { label: 'Offline', className: 'status-offline' }
};

export function StatusBadge({ status, variant = 'default', className }: StatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig];
  
  return (
    <Badge 
      variant={variant}
      className={cn(
        "border",
        config?.className,
        className
      )}
    >
      {config?.label}
    </Badge>
  );
}
