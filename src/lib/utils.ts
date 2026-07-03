// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

// Tailwind class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Money formatting — always KES, always monospace-ready
export function formatKES(amount: number | string | null | undefined): string {
  // 1. Handle missing data gracefully
  if (amount == null) return 'KES 0';
  
  // 2. Safely parse, removing any potential commas from string formats
  const num = typeof amount === 'string' ? parseFloat(amount.toString().replace(/,/g, '')) : amount;
  
  // 3. Fallback if the parse failed
  if (isNaN(num)) return 'KES 0';

  return `KES ${num.toLocaleString('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

// Money formatting — USD (Great for CIF values)
export function formatUSD(amount: number | string | null | undefined): string {
  if (amount == null) return 'USD 0';
  
  const num = typeof amount === 'string' ? parseFloat(amount.toString().replace(/,/g, '')) : amount;
  
  if (isNaN(num)) return 'USD 0';

  return `USD ${num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

// Relative time for recent events, absolute for older ones
export function smartDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Unknown date';
  try {
    const date = new Date(dateStr);
    const hoursAgo = (Date.now() - date.getTime()) / 3600000;
    if (hoursAgo < 24) return formatDistanceToNow(date, { addSuffix: true });
    return format(date, 'dd MMM yyyy · HH:mm');
  } catch {
    return 'Invalid date';
  }
}

// Demurrage calculation
export function calculateDemurrage(
  dischargedAt: string,
  freePeriodDays: number,
  dailyRate: number
): { daysInDemurrage: number; totalCost: number; isInDemurrage: boolean; freeEndsAt: Date } {
  const discharged = new Date(dischargedAt);
  const freeEndsAt = new Date(discharged.getTime() + freePeriodDays * 86400000);
  const now = new Date();
  
  const isInDemurrage = now > freeEndsAt;
  const daysInDemurrage = isInDemurrage
    ? Math.ceil((now.getTime() - freeEndsAt.getTime()) / 86400000)
    : 0;
    
  return {
    daysInDemurrage,
    totalCost: daysInDemurrage * dailyRate,
    isInDemurrage,
    freeEndsAt,
  };
}