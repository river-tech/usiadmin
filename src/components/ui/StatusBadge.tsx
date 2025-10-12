import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'draft' | 'published' | 'unpublished' | 'suspended' | 'failed' | 'refunded';
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

const statusConfig = {
  active: { label: 'Active', className: 'status-active' },
  inactive: { label: 'Inactive', className: 'status-inactive' },
  pending: { label: 'Pending', className: 'status-pending' },
  completed: { label: 'Completed', className: 'status-completed' },
  draft: { label: 'Draft', className: 'status-draft' },
  published: { label: 'Published', className: 'status-published' },
  unpublished: { label: 'Unpublished', className: 'status-unpublished' },
  suspended: { label: 'Suspended', className: 'status-suspended' },
  failed: { label: 'Failed', className: 'status-failed' },
  refunded: { label: 'Refunded', className: 'status-refunded' }
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
