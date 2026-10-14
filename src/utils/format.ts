import type { TrainStatus } from '../types';

export function getStatusConfig(status: TrainStatus, delayMinutes: number = 0) {
  switch (status) {
    case 'ON_TIME':
      return {
        label: 'On Time',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dotBg: 'bg-emerald-500',
        textClass: 'text-emerald-700',
        iconName: 'CheckCircle2'
      };
    case 'DELAYED':
      return {
        label: `Running +${delayMinutes}m Late`,
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        dotBg: 'bg-amber-500',
        textClass: 'text-amber-700',
        iconName: 'Clock'
      };
    case 'EARLY':
      return {
        label: `Running ${Math.abs(delayMinutes)}m Early`,
        badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
        dotBg: 'bg-teal-500',
        textClass: 'text-teal-700',
        iconName: 'Zap'
      };
    case 'AT_STATION':
      return {
        label: 'Halted at Station',
        badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
        dotBg: 'bg-blue-500 animate-pulse',
        textClass: 'text-blue-700',
        iconName: 'MapPin'
      };
    case 'DEPARTED':
      return {
        label: 'Departed Station',
        badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        dotBg: 'bg-indigo-500',
        textClass: 'text-indigo-700',
        iconName: 'Navigation'
      };
    case 'COMPLETED':
      return {
        label: 'Journey Completed',
        badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
        dotBg: 'bg-slate-500',
        textClass: 'text-slate-700',
        iconName: 'Flag'
      };
    case 'CANCELLED':
      return {
        label: 'Cancelled',
        badgeBg: 'bg-red-50 text-red-700 border-red-200',
        dotBg: 'bg-red-500',
        textClass: 'text-red-700',
        iconName: 'XCircle'
      };
    default:
      return {
        label: 'Status Pending',
        badgeBg: 'bg-slate-50 text-slate-600 border-slate-200',
        dotBg: 'bg-slate-400',
        textClass: 'text-slate-600',
        iconName: 'HelpCircle'
      };
  }
}

export function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
}

export function formatLastUpdated(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffSec = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));
    
    if (diffSec < 10) return 'Just now';
    if (diffSec < 60) return `${diffSec} sec ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} min ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Recently';
  }
}
