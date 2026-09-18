'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { IRevenueChartPoint } from '@/lib/api/dashboard';

interface RevenueOverviewProps {
  data?: IRevenueChartPoint[];
}

const defaultData: IRevenueChartPoint[] = [
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 0 },
  { name: 'Apr', value: 0 },
  { name: 'May', value: 0 },
];

export default function RevenueOverview({ data }: RevenueOverviewProps) {
  const chartData = data && data.length > 0 ? data : defaultData;

  const maxValue = Math.max(...chartData.map((d) => d.value), 1000);
  const roundedMax = Math.ceil(maxValue / 2000) * 2000;
  const step = roundedMax / 4;
  const ticks = [0, step, step * 2, step * 3, roundedMax];

  return (
    <div className="border border-[#e5e5e6] flex w-full xl:flex-1 flex-col gap-6 items-start min-w-px p-6 rounded bg-white h-auto xl:h-full">
      <div className="flex items-center justify-between w-full">
        <p className="font-semibold leading-[1.2] text-[20px] text-black">
          Revenue Overview
        </p>
      </div>
      <div className="h-[300px] shrink-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e6" />
            <XAxis
              dataKey="name"
              axisLine={{ stroke: '#e5e5e6' }}
              tickLine={false}
              tick={{ fill: '#848995', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#848995', fontSize: 12 }}
              domain={[0, roundedMax]}
              ticks={ticks}
              tickFormatter={(val) => (val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`)}
              dx={-5}
            />
            <Tooltip
              formatter={(val: any) => [`$ ${Number(val || 0).toLocaleString()}`, 'Revenue']}
              contentStyle={{
                borderRadius: '4px',
                border: '1px solid #e5e5e6',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                backgroundColor: '#ffffff',
                fontSize: '13px',
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#f09000"
              strokeWidth={2}
              dot={{ r: 4, stroke: '#f09000', strokeWidth: 2, fill: '#ffffff' }}
              activeDot={{ r: 6, stroke: '#f09000', strokeWidth: 2, fill: '#ffffff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
