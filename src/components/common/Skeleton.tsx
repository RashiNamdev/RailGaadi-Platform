import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-6 w-full' }) => (
  <div className={`bg-slate-200/80 animate-pulse rounded-xl ${className}`} />
);

export const JourneyDashboardSkeleton: React.FC = () => (
  <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row gap-4 justify-between">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-10 w-48" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    </div>
  </div>
);
