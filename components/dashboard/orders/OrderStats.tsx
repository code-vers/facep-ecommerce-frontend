"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  CheckSquare,
  AlertCircle,
  XSquare,
} from "lucide-react";

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
    <div className="flex h-38.25 flex-[1_0_0] flex-col items-start gap-6 rounded-lg border border-[#E5E5E6] bg-[#F2F2F3] p-4 min-w-0">
      <div className="flex w-full shrink-0 items-start justify-between">
        <div
          className="flex shrink-0 items-center rounded-xs p-2.5"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon size={16} className="text-[#42454D]" />
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <div className="flex shrink-0 items-center gap-2 rounded-lg py-0.5">
            <span className="whitespace-nowrap text-[12px] font-normal leading-[1.3] text-[#848995]">
              {period}
            </span>
            <ChevronDown size={12} className="text-[#848995]" />
          </div>
          <div
            className={`flex w-full shrink-0 items-center gap-1 rounded-xs px-2.5 py-0.5 ${
              isTrendPositive ? "bg-[#E0EBE4]" : "bg-[#ECDFDF]"
            }`}
          >
            {isTrendPositive ? (
              <TrendingUp size={12} className="text-[#229A4E]" />
            ) : (
              <TrendingDown size={12} className="text-[#CB1B1B]" />
            )}
            <span
              className={`whitespace-nowrap text-[12px] font-normal leading-[1.3] ${
                isTrendPositive ? "text-[#229A4E]" : "text-[#CB1B1B]"
              }`}
            >
              {trendValue}
            </span>
          </div>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-start gap-1 whitespace-nowrap">
        <p className="font-[Arial] text-[24px] leading-[1.2] text-black">
          {value}
        </p>
        <p className="text-[14px] font-normal leading-[1.3] text-[#42454D]">
          {title}
        </p>
      </div>
    </div>
  );
};

export default function OrderStats() {
  const { session } = useAuth();
  const isAdmin = session?.user?.role === "ADMIN";
  const isVendor = session?.user?.role === "VENDOR";

  const { data: apiData } = useQuery({
    queryKey: ["dashboard-orders-stats", session?.user?.role],
    queryFn: async () => {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/checkout/vendor-orders?page=1&limit=1`,
      );
      const res = await fetch(url.toString(), {
        headers: {
          ...(session?.token
            ? { Authorization: `Bearer ${session.token}` }
            : {}),
        },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json;
    },
    enabled: !!session?.token && (isVendor || isAdmin),
  });

  const backendStats = apiData?.meta?.stats;

  const currentMonthName = new Date().toLocaleString("default", {
    month: "long",
  });

  const stats = [
    {
      title: "Total Orders",
      value: backendStats?.totalOrders || 0,
      period: currentMonthName,
      trendValue: "0%",
      isTrendPositive: true,
      iconBgColor: "#EDE7DE",
      icon: ShoppingBag,
    },
    {
      title: "Completed Orders",
      value: backendStats?.completedOrders || 0,
      period: currentMonthName,
      trendValue: "0%",
      isTrendPositive: true,
      iconBgColor: "#E0EBE4",
      icon: CheckSquare,
    },
    {
      title: "Pending Orders",
      value: backendStats?.pendingOrders || 0,
      period: currentMonthName,
      trendValue: "0%",
      isTrendPositive: false,
      iconBgColor: "#EEEBE2",
      icon: AlertCircle,
    },
    {
      title: "Cancelled Orders",
      value: backendStats?.cancelledOrders || 0,
      period: currentMonthName,
      trendValue: "0%",
      isTrendPositive: true,
      iconBgColor: "#ECDFDF",
      icon: XSquare,
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 2xl:gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
