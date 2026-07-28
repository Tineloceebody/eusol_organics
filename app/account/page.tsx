"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Order } from "@/lib/types";
import { getOrdersByUserId } from "@/lib/db";
import { useSupabaseAuth } from "@/lib/supabase-auth-context";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  User,
  ShoppingBag,
  MapPin,
  Clock,
  ChevronRight,
  Phone,
  Mail,
  Building2,
  ExternalLink,
  CheckCircle,
} from "lucide-react";

export default function CustomerAccountPage() {
  const { user, profile, updateProfile } = useSupabaseAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("East Legon");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setPhone(profile.phone || "");
      setArea(profile.area || "East Legon");
      setAddress(profile.address || "");
      setLandmark(profile.landmark || "");
    }
  }, [profile]);

  // Fetch orders & Subscribe to Realtime Updates
  useEffect(() => {
    const userId = user?.id || user?.email || "guest";

    const loadOrders = async () => {
      setLoading(true);
      const data = await getOrdersByUserId(userId);
      setOrders(data);
      setLoading(false);
    };

    loadOrders();

    // Supabase Realtime Subscription for Live Order Tracking
    if (isSupabaseConfigured()) {
      const channel = supabase
        .channel("public:orders")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "orders" },
          () => {
            loadOrders();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile({
      fullName,
      phone,
      area,
      address,
      landmark,
    });

    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f2e6] text-[#1f1b13]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-28 pb-24 md:pt-36">
        {/* Account Top Profile Banner */}
        <div className="bg-white/90 border border-[#e7dcc4] rounded-3xl p-6 md:p-8 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#efe8d7] border border-[#e7dcc4] flex items-center justify-center text-[#7f6b4f] font-serif text-2xl font-bold">
              {(profile?.fullName || user?.email || "C").charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#1f1b13]">
                {profile?.fullName || user?.email || "EUSOL Valued Client"}
              </h1>
              <p className="text-xs text-[#5a5041] mt-0.5 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#7f6b4f]" />
                Primary Region: <strong>Greater Accra</strong>
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "orders"
                  ? "bg-[#7f6b4f] text-white shadow-sm"
                  : "bg-[#efe8d7] text-[#7f6b4f] hover:bg-[#e7dcc4]"
              }`}
            >
              Order History ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "profile"
                  ? "bg-[#7f6b4f] text-white shadow-sm"
                  : "bg-[#efe8d7] text-[#7f6b4f] hover:bg-[#e7dcc4]"
              }`}
            >
              Saved Accra Address
            </button>
          </div>
        </div>

        {/* Tab 1: Orders History */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl font-semibold text-[#1f1b13] flex items-center gap-2">
                Realtime Order Tracking & History
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block" title="Live Supabase Sync" />
              </h2>
              <Link
                href="/shop"
                className="text-xs font-bold text-[#7f6b4f] hover:underline flex items-center gap-1"
              >
                Browse Shop
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="bg-white/90 border border-[#e7dcc4] rounded-3xl p-12 text-center">
                <div className="w-8 h-8 border-3 border-[#7f6b4f] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-[#5a5041]">Syncing live Supabase order records...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white/90 border border-[#e7dcc4] rounded-3xl p-12 text-center">
                <ShoppingBag className="w-12 h-12 text-[#7f6b4f]/30 mx-auto mb-4" />
                <h3 className="font-serif text-lg font-semibold text-[#1f1b13] mb-2">
                  No Orders Found
                </h3>
                <p className="text-xs text-[#5a5041] max-w-sm mx-auto mb-6">
                  You haven&apos;t placed any orders yet. Explore our handcrafted organic botanicals to start your wellness ritual.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-[#7f6b4f] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#685740] transition-colors"
                >
                  Explore Botanicals
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white/90 border border-[#e7dcc4] rounded-3xl p-6 shadow-sm hover:border-[#7f6b4f]/50 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e7dcc4]/60 gap-2 mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-serif text-lg font-bold text-[#1f1b13]">
                            #{ord.orderNumber}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              ord.orderStatus === "delivered"
                                ? "bg-green-100 text-green-800"
                                : ord.orderStatus === "out_for_delivery"
                                ? "bg-blue-100 text-blue-800 animate-pulse"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {ord.orderStatus.replace(/_/g, " ")}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5a5041] mt-1 flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-[#7f6b4f]" />
                          Placed on: {new Date(ord.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-serif text-lg font-bold text-[#7f6b4f]">
                          GHS {ord.totalAmount}
                        </p>
                        <p className="text-[11px] text-[#5a5041] capitalize">
                          {ord.paymentMethod === "paystack"
                            ? "Paid via Paystack"
                            : ord.paymentMethod === "cod"
                            ? "Payment on Delivery"
                            : "WhatsApp Order"}
                        </p>
                      </div>
                    </div>

                    {/* Order Thumbnails */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 overflow-x-auto py-1">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-[#efe8d7]/50 p-1.5 pr-3 rounded-xl border border-[#e7dcc4]">
                            <img
                              src={it.image}
                              alt={it.name}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                            <span className="text-xs font-bold text-[#1f1b13]">
                              {it.quantity}x {it.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      <Link
                        href={`/checkout/success/${ord.id}`}
                        className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-[#7f6b4f] hover:text-[#1f1b13] bg-[#efe8d7] px-4 py-2.5 rounded-xl transition-colors"
                      >
                        Track Live Status
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Address Profile */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="bg-white/90 border border-[#e7dcc4] rounded-3xl p-6 md:p-8 shadow-sm space-y-6 animate-fadeIn">
            <h2 className="font-serif text-xl font-semibold text-[#1f1b13] border-b border-[#e7dcc4] pb-4">
              Saved Delivery Details (Greater Accra)
            </h2>

            {saveSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Profile address saved to Supabase successfully!</span>
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5a5041] mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#7f6b4f]" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e7dcc4] bg-white text-sm text-[#1f1b13]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5a5041] mb-2 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#7f6b4f]" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e7dcc4] bg-white text-sm text-[#1f1b13]"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5a5041] mb-2 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#7f6b4f]" />
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || profile?.email || ""}
                  className="w-full px-4 py-3 rounded-xl border border-[#e7dcc4] bg-[#efe8d7]/50 text-sm text-[#7f6b4f] font-bold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5a5041] mb-2 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#7f6b4f]" />
                  Greater Accra Area
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e7dcc4] bg-white text-sm text-[#1f1b13]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5a5041] mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#7f6b4f]" />
                Primary Street / Digital Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#e7dcc4] bg-white text-sm text-[#1f1b13]"
              />
            </div>

            <button
              type="submit"
              className="bg-[#7f6b4f] text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#685740] transition-colors"
            >
              Save Address Preferences
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
