import React from 'react';
import { CheckCircle2, Clock, Zap, MapPin, Navigation, Flag, XCircle, HelpCircle } from 'lucide-react';
import type { TrainStatus } from '../../types';
import { getStatusConfig } from '../../utils/format';

interface StatusBadgeProps {
  status: TrainStatus;
  delayMinutes?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  delayMinutes = 0,
  size = 'md',
}) => {
  const config = getStatusConfig(status, delayMinutes);

  const icons = {
    CheckCircle2,
    Clock,
    Zap,
    MapPin,
    Navigation,
    Flag,
    XCircle,
    HelpCircle,
  };
  const IconComponent = icons[config.iconName as keyof typeof icons] || Clock;

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2.5 font-bold',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={`inline-flex items-center rounded-xl border font-semibold tracking-wide transition-all shadow-sm ${config.badgeBg} ${sizeClasses[size]}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dotBg}`} />
      <IconComponent className={`${iconSizes[size]} ${config.textClass}`} />
      <span>{config.label}</span>
    </div>
  );
};
