"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Eye, FileDown, Search } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "PENDING_PAYMENT", label: "Pending Payment" },
  { value: "PAID", label: "Paid" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const getStatusStyles = (status: OrderStatus) => {
  switch (status) {
    case "SHIPPED":
      return "bg-[#E0EBE4] text-[#229A4E]";
    case "DELIVERED":
      return "bg-[#E5E5E6] text-[#42454D]";
    case "PROCESSING":
      return "bg-[#E6F0FA] text-[#165DD0]";
    case "PENDING_PAYMENT":
    case "PAID":
      return "bg-[#FDF5D3] text-[#F09000]";
    case "CANCELLED":
      return "bg-[#ECDFDF] text-[#CB1B1B]";
    default:
      return "bg-[#E5E5E6] text-[#42454D]";
  }
};

const getStatusLabel = (status: OrderStatus) => {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label || status;
};

export default function OrdersTable() {
  const { session } = useAuth();
  const isAdmin = session?.user?.role === "ADMIN";
  const isVendor = session?.user?.role === "VENDOR";

  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchOrders = async (page: number, search: string) => {
    // Let's use vendor-orders for VENDOR and ADMIN (admin bypasses vendorId check in backend)
    const url = new URL(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/checkout/vendor-orders`,
    );
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", "10");
    if (search) url.searchParams.append("search", search);

    const res = await fetch(url.toString(), {
      headers: {
        ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      },
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json;
  };

  const { data: apiData, isLoading } = useQuery({
    queryKey: [
      "dashboard-orders",
      currentPage,
      debouncedSearch,
      session?.user?.role,
    ],
    queryFn: () => fetchOrders(currentPage, debouncedSearch),
    enabled: !!session?.token && (isVendor || isAdmin),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: OrderStatus;
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/checkout/vendor-orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(session?.token
              ? { Authorization: `Bearer ${session.token}` }
              : {}),
          },
          body: JSON.stringify({ status }),
        },
      );
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-orders"] });
      setOpenStatusDropdown(null);
    },
  });

  const orders = useMemo(() => {
    if (!apiData?.data) return [];
    return apiData.data.map((dbOrder: any) => {
      const items = dbOrder.items
        .map((item: any) => item.productName)
        .join(", ");
      const store = dbOrder.items[0]?.vendorName || "N/A";

      return {
        id: dbOrder.id,
        orderNumber: dbOrder.orderNumber,
        customer: dbOrder.fullName,
        contactNo: dbOrder.contactNumber,
        product: items,
        amount: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(Number(dbOrder.total)),
        date: new Date(dbOrder.createdAt).toLocaleDateString(),
        status: dbOrder.status as OrderStatus,
        store: store,
      };
    });
  }, [apiData]);

  const totalPages = apiData?.meta?.totalPages || 1;

  if (!isVendor && !isAdmin) {
    return (
      <div className="p-8 text-center text-gray-500">
        You do not have access to this page.
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-5 rounded-[12px] bg-white pt-5 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between px-5">
        <h2 className="text-[18px] font-semibold leading-[1.3] text-black">
          All Orders
        </h2>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-[#E5E5E6] rounded-xs px-3 py-1.5 min-w-50">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="outline-none text-[12px] w-full"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 border border-[#E5E5E6] px-4 py-2 hover:bg-gray-50 transition-colors">
            <span className="text-[14px] font-medium leading-[1.2] text-[#42454D]">
              Export
            </span>
            <FileDown size={14} className="text-[#42454D]" />
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="flex min-w-250 flex-col pb-4">
          <div className="flex w-full shrink-0 items-center bg-[#F9F9F9] h-12">
            <div className="w-25 shrink-0 px-2">
              <p className="whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black">
                Order ID
              </p>
            </div>
            <div className="w-37.5 shrink-0 px-2">
              <p className="whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black">
                Customer
              </p>
            </div>
            {isAdmin ? (
              <div className="w-37.5 shrink-0 px-2">
                <p className="whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black">
                  Store
                </p>
              </div>
            ) : (
              <div className="w-37.5 shrink-0 px-2">
                <p className="whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black">
                  Contact No.
                </p>
              </div>
            )}
            <div className="min-w-37.5 flex-[1_0_0] px-2">
              <p className="whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black">
                Product
              </p>
            </div>
            <div className="w-25 shrink-0 px-2">
              <p className="whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black">
                Amount
              </p>
            </div>
            {!isAdmin && (
              <div className="w-30 shrink-0 px-2">
                <p className="whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black">
                  Date
                </p>
              </div>
            )}
            <div className="w-40 shrink-0 px-2">
              <p className="whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black">
                Status
              </p>
            </div>
            <div className="w-25 shrink-0 px-2 text-center">
              <p className="whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black">
                Action
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="w-full py-10 text-center text-gray-500">
              Loading...
            </div>
          ) : orders.length === 0 ? (
            <div className="w-full py-10 text-center text-gray-500">
              No orders found.
            </div>
          ) : (
            orders.map((order: any, idx: number) => (
              <div
                key={idx}
                className="flex w-full shrink-0 items-center border-b border-[#E5E5E6] h-14 hover:bg-gray-50 transition-colors"
              >
                <div className="w-25 shrink-0 px-2">
                  <p className="truncate text-[12px] font-normal leading-[1.3] text-[#42454D]">
                    {order.orderNumber}
                  </p>
                </div>
                <div className="w-37.5 shrink-0 px-2">
                  <p className="truncate text-[12px] font-normal leading-[1.3] text-[#42454D]">
                    {order.customer}
                  </p>
                </div>
                {isAdmin ? (
                  <div className="w-37.5 shrink-0 px-2">
                    <p className="truncate text-[12px] font-normal leading-[1.3] text-[#42454D]">
                      {order.store}
                    </p>
                  </div>
                ) : (
                  <div className="w-37.5 shrink-0 px-2">
                    <p className="truncate text-[12px] font-normal leading-[1.3] text-[#42454D]">
                      {order.contactNo}
                    </p>
                  </div>
                )}
                <div className="min-w-37.5 flex-[1_0_0] px-2">
                  <p className="truncate text-[12px] font-normal leading-[1.3] text-[#42454D]">
                    {order.product}
                  </p>
                </div>
                <div className="w-25 shrink-0 px-2">
                  <p className="truncate text-[12px] font-normal leading-[1.3] text-[#42454D]">
                    {order.amount}
                  </p>
                </div>
                {!isAdmin && (
                  <div className="w-30 shrink-0 px-2">
                    <p className="truncate text-[12px] font-normal leading-[1.3] text-[#42454D]">
                      {order.date}
                    </p>
                  </div>
                )}
                <div className="w-40 shrink-0 px-2 relative">
                  <div
                    onClick={() =>
                      setOpenStatusDropdown(
                        openStatusDropdown === order.id ? null : order.id,
                      )
                    }
                    className={`inline-flex h-7 items-center justify-between gap-2 rounded-xs px-2 cursor-pointer select-none ${getStatusStyles(order.status)} ${updateStatusMutation.isPending && updateStatusMutation.variables?.orderId === order.id ? "opacity-50" : ""}`}
                  >
                    <span className="text-[11px] font-medium leading-[1.2]">
                      {getStatusLabel(order.status)}
                    </span>
                    <ChevronDown size={12} />
                  </div>

                  {openStatusDropdown === order.id && (
                    <div className="absolute top-9 left-2 w-35 bg-white shadow-lg border border-gray-100 rounded-md py-1 z-50">
                      {STATUS_OPTIONS.map((opt) => (
                        <div
                          key={opt.value}
                          onClick={() => {
                            updateStatusMutation.mutate({
                              orderId: order.id,
                              status: opt.value,
                            });
                          }}
                          className={`px-3 py-1.5 text-[12px] hover:bg-gray-50 cursor-pointer ${order.status === opt.value ? "font-bold bg-gray-50" : "text-gray-700"}`}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="w-25 shrink-0 px-2">
                  <div className="flex items-center justify-center gap-3">
                    <button className="text-[#42454D] hover:text-black transition-colors">
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-6 border-t border-[#E5E5E6]">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 flex items-center justify-center text-sm border rounded ${currentPage === i + 1 ? "bg-black text-white" : "hover:bg-gray-50"}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
