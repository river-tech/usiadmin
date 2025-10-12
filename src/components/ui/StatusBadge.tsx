import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'ACTIVE' | 'PENDING' | 'REJECT' | 'expired';
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

const statusConfig = {
  active: { label: 'Active', className: 'status-active' },
  inactive: { label: 'Inactive', className: 'status-inactive' },
  ACTIVE: { label: 'Completed', className: 'status-completed' },
  PENDING: { label: 'Pending', className: 'status-pending' },
  REJECT: { label: 'Rejected', className: 'status-failed' },
  expired: { label: 'Expired', className: 'status-unpublished' }
};

export function StatusBadge({ status, variant = 'default', className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant={variant}
      className={cn(
        "border",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
