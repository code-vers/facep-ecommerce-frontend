'use client';

import React from 'react';
import { Ticket, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { useCouponStats } from '@/hooks/api/useCoupon';

export default function CouponStatsCards() {
  const { data: stats, isLoading } = useCouponStats();

  const cards = [
    {
      title: 'Total Coupons',
      value: isLoading ? '...' : stats?.totalCoupons ?? 0,
      subtext: 'Created across platform',
      icon: Ticket,
      iconBg: 'bg-blue-50 text-blue-600',
      borderAccent: 'border-blue-200',
    },
    {
      title: 'Active Coupons',
      value: isLoading ? '...' : stats?.activeCoupons ?? 0,
      subtext: 'Currently valid & running',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600',
      borderAccent: 'border-emerald-200',
    },
    {
      title: 'Total Redemptions',
      value: isLoading ? '...' : stats?.totalRedemptions ?? 0,
      subtext: 'Customer checkouts applied',
      icon: TrendingUp,
      iconBg: 'bg-amber-50 text-amber-600',
      borderAccent: 'border-amber-200',
    },
    {
      title: 'Expiring Soon',
      value: isLoading ? '...' : stats?.expiringSoon ?? 0,
      subtext: 'Within next 7 days',
      icon: AlertTriangle,
      iconBg: 'bg-red-50 text-red-600',
      borderAccent: 'border-red-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`bg-white border ${card.borderAccent} rounded-xl p-4 sm:p-5 shadow-2xs flex items-center justify-between transition-all hover:shadow-xs`}
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {card.title}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-black">
                {card.value}
              </span>
              <span className="text-[11px] text-gray-500">
                {card.subtext}
              </span>
            </div>

            <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}>
              <Icon size={22} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
