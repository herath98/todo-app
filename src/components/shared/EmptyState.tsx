import React from 'react';
import { cn } from '../../lib/utils';
import { InboxIcon } from 'lucide-react';
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}
export function EmptyState({
  icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}>

      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        {icon ?? <InboxIcon className="w-6 h-6 text-muted-foreground" />}
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      {description &&
      <p className="text-sm text-muted-foreground max-w-sm mb-4">
          {description}
        </p>
      }
      {action && <div className="mt-2">{action}</div>}
    </div>);

}