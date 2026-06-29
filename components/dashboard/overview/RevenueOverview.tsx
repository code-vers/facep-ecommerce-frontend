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

const data = [
  { name: 'Jan', value: 3000 },
  { name: 'Feb', value: 4500 },
  { name: 'Mar', value: 3800 },
  { name: 'Apr', value: 6000 },
  { name: 'May', value: 7800 },
];

export default function RevenueOverview() {
  return (
    <div className="border border-[#e5e5e6] flex w-full xl:flex-1 flex-col gap-6 items-start min-w-px p-6 rounded bg-white h-auto xl:h-full">
      <p className="font-semibold leading-[1.2] text-[20px] text-black w-full">
        Revenue Overview
      </p>
      <div className="h-[300px] shrink-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e6" />
            <XAxis
              dataKey="name"
              axisLine={{ stroke: '#e5e5e6' }}
              tickLine={false}
              tick={{ fill: '#cacbce', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#cacbce', fontSize: 12 }}
              domain={[0, 8000]}
              ticks={[0, 2000, 4000, 6000, 8000]}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '4px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
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
