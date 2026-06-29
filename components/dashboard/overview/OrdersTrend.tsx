'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Jan', value: 125 },
  { name: 'Feb', value: 190 },
  { name: 'Mar', value: 165 },
  { name: 'Apr', value: 245 },
  { name: 'May', value: 275 },
];

export default function OrdersTrend() {
  return (
    <div className="border border-[#e5e5e6] flex w-full xl:flex-1 flex-col gap-6 items-start min-w-px p-6 rounded bg-white h-auto xl:h-full">
      <p className="font-semibold leading-[1.2] text-[20px] text-black w-full">
        Orders Trend
      </p>
      <div className="h-[300px] shrink-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              domain={[0, 280]}
              ticks={[0, 70, 140, 210, 280]}
              dx={-10}
            />
            <Tooltip
              cursor={{ fill: '#f2f2f3' }}
              contentStyle={{
                borderRadius: '4px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Bar dataKey="value" fill="#f09000" barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
