'use client';

import {
  ChevronDown,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  CheckSquare,
  AlertCircle,
  XSquare,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  period: string;
  trendValue: string;
  isTrendPositive: boolean;
  iconBgColor: string;
  icon: React.ElementType;
}

const StatCard = ({
  title,
  value,
  period,
  trendValue,
  isTrendPositive,
  iconBgColor,
  icon: Icon,
}: StatCardProps) => {
  return (
    <div className='flex h-[153px] flex-[1_0_0] flex-col items-start gap-[24px] rounded-[4px] border border-[#E5E5E6] bg-[#F2F2F3] p-[16px] min-w-0'>
      <div className='flex w-full shrink-0 items-start justify-between'>
        <div
          className='flex shrink-0 items-center rounded-[2px] p-[10px]'
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon size={16} className='text-[#42454D]' />
        </div>
        <div className='flex shrink-0 flex-col items-end gap-[6px]'>
          <div className='flex shrink-0 items-center gap-[8px] rounded-[4px] py-[2px]'>
            <span className='whitespace-nowrap text-[12px] font-normal leading-[1.3] text-[#848995]'>
              {period}
            </span>
            <ChevronDown size={12} className='text-[#848995]' />
          </div>
          <div
            className={`flex w-full shrink-0 items-center gap-[4px] rounded-[2px] px-[10px] py-[2px] ${
              isTrendPositive ? 'bg-[#E0EBE4]' : 'bg-[#ECDFDF]'
            }`}
          >
            {isTrendPositive ? (
              <TrendingUp size={12} className='text-[#229A4E]' />
            ) : (
              <TrendingDown size={12} className='text-[#CB1B1B]' />
            )}
            <span
              className={`whitespace-nowrap text-[12px] font-normal leading-[1.3] ${
                isTrendPositive ? 'text-[#229A4E]' : 'text-[#CB1B1B]'
              }`}
            >
              {trendValue}
            </span>
          </div>
        </div>
      </div>
      <div className='flex shrink-0 flex-col items-start gap-[4px] whitespace-nowrap'>
        <p className='font-[Arial] text-[24px] leading-[1.2] text-black'>{value}</p>
        <p className='text-[14px] font-normal leading-[1.3] text-[#42454D]'>{title}</p>
      </div>
    </div>
  );
};

export default function OrderStats() {
  const stats = [
    {
      title: 'Total Orders',
      value: '10000',
      period: 'January',
      trendValue: '10%',
      isTrendPositive: true,
      iconBgColor: '#EDE7DE',
      icon: ShoppingBag,
    },
    {
      title: 'Completed Orders',
      value: '400',
      period: 'January',
      trendValue: '10%',
      isTrendPositive: true,
      iconBgColor: '#E0EBE4',
      icon: CheckSquare,
    },
    {
      title: 'Pending Orders',
      value: '100',
      period: 'January',
      trendValue: '10%',
      isTrendPositive: false,
      iconBgColor: '#EEEBE2',
      icon: AlertCircle,
    },
    {
      title: 'Cancelled Orders',
      value: '20',
      period: 'January',
      trendValue: '10%',
      isTrendPositive: true,
      iconBgColor: '#ECDFDF',
      icon: XSquare,
    },
  ];

  return (
    <div className='grid w-full grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-4 2xl:gap-[24px]'>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
