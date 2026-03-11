/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface KpiCardProps {
  title: string;
  value: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  variant?: 'sand' | 'taupe';
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, trend, variant = 'sand' }) => {
  return (
    <div className={cn(
      "p-6 rounded-2xl flex flex-col justify-between h-36 border border-earth-border/20 transition-all hover:shadow-md",
      variant === 'sand' ? "bg-earth-card-sand text-earth-sidebar" : "bg-earth-card-taupe text-white"
    )}>
      <p className={cn(
        "text-xs uppercase tracking-wider font-semibold opacity-70",
        variant === 'taupe' && "opacity-80"
      )}>
        {title}
      </p>
      <div>
        <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
        {trend && (
          <p className={cn(
            "text-xs font-bold flex items-center gap-1 mt-2",
            trend.isUp ? "text-emerald-600" : "text-red-500",
            variant === 'taupe' && (trend.isUp ? "text-emerald-300" : "text-red-300")
          )}>
            {trend.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}
          </p>
        )}
      </div>
    </div>
  );
};
