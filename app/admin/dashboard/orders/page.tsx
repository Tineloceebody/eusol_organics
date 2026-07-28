"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Order, OrderStatus } from "@/lib/types";
import { updateOrderStatus } from "@/lib/db";
import { getOrdersByUserId } from "@/lib/db";
import {
  Package,
  Clock,
  Phone,
  MapPin,
  RefreshCw,
  Search,
  Filter,
  DollarSign,
  Building2,
  Printer,
  ChevronLeft,
} from "lucide-react";

export default function AdminOrdersDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAllOrders = async () => {
    setLoading(true);
    // Fetch all orders from storage/Supabase
    const all = await getOrdersByUserId("guest");
    setOrders(all);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    let newPaymentStatus: Order["paymentStatus"] | undefined = undefined;
    if (newStatus === "delivered") {
      newPaymentStatus = "paid";
    }

    await updateOrderStatus(orderId, newStatus, newPaymentStatus);
    await fetchAllOrders();
    setUpdatingId(null);
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = filterStatus === "all" || ord.orderStatus === filterStatus;
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerInfo.phone.includes(searchQuery) ||
      ord.customerInfo.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const pendingCount = orders.filter((o) => o.orderStatus !== "delivered").length;

  return (
    <div className="min-h-screen bg-[#f8f2e6] text-[#1f1b13]">
      {/* Admin Top Header */}
      <header className="bg-white border-b border-[#e7dcc4] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="p-2 bg-[#efe8d7] rounded-xl text-[#7f6b4f] hover:bg-[#e7dcc4] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-serif text-xl font-bold text-[#1f1b13]">
                EUSOL Organics — Orders Console
              </h1>
              <p className="text-xs text-[#5a5041]">
                Managing Greater Accra Deliveries & Dispatch
              </p>
            </div>
          </div>

          <button
            onClick={fetchAllOrders}
            className="flex items-center gap-2 bg-[#efe8d7] text-[#7f6b4f] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#e7dcc4] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Orders
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="bg-white/90 border border-[#e7dcc4] rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between text-[#7f6b4f] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
              <DollarSign className="w-5 h-5" />
            </div>
            <p className="font-serif text-3xl font-bold text-[#1f1b13]">GHS {totalRevenue}</p>
            <p className="text-[11px] text-[#5a5041] mt-1">Across all Greater Accra orders</p>
          </div>

          <div className="bg-white/90 border border-[#e7dcc4] rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between text-[#7f6b4f] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Orders</span>
              <Clock className="w-5 h-5" />
            </div>
            <p className="font-serif text-3xl font-bold text-[#1f1b13]">{pendingCount}</p>
            <p className="text-[11px] text-[#5a5041] mt-1">Requires dispatch or packing</p>
          </div>

          <div className="bg-white/90 border border-[#e7dcc4] rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between text-[#7f6b4f] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Active Region</span>
              <Building2 className="w-5 h-5" />
            </div>
            <p className="font-serif text-xl font-bold text-[#1f1b13]">Greater Accra</p>
            <p className="text-[11px] text-[#5a5041] mt-1">Local delivery hub operational</p>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white/90 border border-[#e7dcc4] rounded-3xl p-6 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#7f6b4f] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order #, customer name, phone or Accra area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e7dcc4] text-xs text-[#1f1b13] focus:outline-none focus:ring-2 focus:ring-[#7f6b4f]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-[#7f6b4f] flex-shrink-0" />
            {["all", "placed", "processing", "out_for_delivery", "delivered"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  filterStatus === st
                    ? "bg-[#7f6b4f] text-white shadow-sm"
                    : "bg-[#efe8d7] text-[#7f6b4f] hover:bg-[#e7dcc4]"
                }`}
              >
                {st.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table / List */}
        {loading ? (
          <div className="bg-white/90 border border-[#e7dcc4] rounded-3xl p-12 text-center">
            <div className="w-8 h-8 border-3 border-[#7f6b4f] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-[#5a5041]">Loading orders from storage...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white/90 border border-[#e7dcc4] rounded-3xl p-12 text-center">
            <Package className="w-12 h-12 text-[#7f6b4f]/30 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-semibold text-[#1f1b13] mb-1">
              No Orders Found
            </h3>
            <p className="text-xs text-[#5a5041]">Try adjusting your search query or status filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white/90 border border-[#e7dcc4] rounded-3xl p-6 shadow-sm hover:border-[#7f6b4f]/50 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e7dcc4]/60 pb-4 gap-2">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-xl font-bold text-[#1f1b13]">
                        #{ord.orderNumber}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ord.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {ord.paymentStatus} ({ord.paymentMethod})
                      </span>
                    </div>
                    <p className="text-xs text-[#5a5041] mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#7f6b4f]" />
                      Placed: {new Date(ord.createdAt).toLocaleString("en-GB")}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#5a5041]">Update Status:</span>
                    <select
                      value={ord.orderStatus}
                      disabled={updatingId === ord.id}
                      onChange={(e) =>
                        handleStatusChange(ord.id, e.target.value as OrderStatus)
                      }
                      className="px-3 py-2 rounded-xl border border-[#e7dcc4] bg-[#efe8d7] text-xs font-bold text-[#7f6b4f] focus:outline-none focus:ring-2 focus:ring-[#7f6b4f]"
                    >
                      <option value="placed">Placed</option>
                      <option value="processing">Processing</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Customer & Location Grid */}
                <div className="grid gap-4 sm:grid-cols-3 text-xs bg-[#efe8d7]/40 p-4 rounded-2xl border border-[#e7dcc4]">
                  <div>
                    <p className="font-bold text-[#7f6b4f] uppercase tracking-wider mb-1">
                      Customer
                    </p>
                    <p className="font-semibold text-[#1f1b13]">{ord.customerInfo.fullName}</p>
                    <p className="text-[#5a5041] flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-[#7f6b4f]" />
                      {ord.customerInfo.phone}
                    </p>
                  </div>

                  <div>
                    <p className="font-bold text-[#7f6b4f] uppercase tracking-wider mb-1">
                      Accra Delivery Area
                    </p>
                    <p className="font-semibold text-[#1f1b13] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#7f6b4f]" />
                      {ord.customerInfo.area}
                    </p>
                    <p className="text-[#5a5041] truncate">{ord.customerInfo.address}</p>
                  </div>

                  <div>
                    <p className="font-bold text-[#7f6b4f] uppercase tracking-wider mb-1">
                      Total Amount
                    </p>
                    <p className="font-serif text-lg font-bold text-[#7f6b4f]">
                      GHS {ord.totalAmount}
                    </p>
                    <p className="text-[11px] text-[#5a5041]">
                      Items: GHS {ord.subtotal} | Delivery: GHS {ord.deliveryFee}
                    </p>
                  </div>
                </div>

                {/* Items & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {ord.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#e7dcc4] text-xs"
                      >
                        <img
                          src={it.image}
                          alt={it.name}
                          className="w-7 h-7 object-cover rounded-md"
                        />
                        <span className="font-semibold text-[#1f1b13]">
                          {it.quantity}x {it.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 rounded-xl bg-[#efe8d7] text-[#7f6b4f] text-xs font-bold uppercase tracking-wider hover:bg-[#e7dcc4] transition-colors flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print Manifest
                    </button>
                    <a
                      href={`https://wa.me/233${ord.customerInfo.phone.replace(/^0/, "")}?text=${encodeURIComponent(
                        `Hello ${ord.customerInfo.fullName}, this is EUSOL Organics regarding your Order #${ord.orderNumber}. Your delivery status is now: ${ord.orderStatus.replace(/_/g, " ")}.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider hover:brightness-105 transition-all flex items-center gap-1.5"
                    >
                      WhatsApp Client
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
