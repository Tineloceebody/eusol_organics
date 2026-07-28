"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Order } from "@/lib/types";
import { getOrderById } from "@/lib/db";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  CheckCircle,
  Truck,
  MapPin,
  Clock,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  Package,
  Check,
} from "lucide-react";

export default function OrderSuccessClient() {
  const params = useParams();
  const orderId = (params?.id as string) || "";
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      const data = await getOrderById(orderId);
      setOrder(data);
      setLoading(false);
    };

    fetchOrder();

    if (isSupabaseConfigured()) {
      const channel = supabase
        .channel(`order:${orderId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "orders",
            filter: `id=eq.${orderId}`,
          },
          (payload) => {
            if (payload.new) {
              fetchOrder();
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f2e6] text-[#1f1b13]">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-40 text-center">
          <div className="w-12 h-12 border-4 border-[#7f6b4f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-lg text-[#5a5041]">Loading your order confirmation...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f8f2e6] text-[#1f1b13]">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-32 text-center">
          <Package className="w-16 h-16 text-[#7f6b4f]/40 mx-auto mb-4" />
          <h1 className="font-serif text-3xl font-semibold mb-4">Order Record Found</h1>
          <p className="text-[#5a5041] mb-8">
            Thank you for shopping with EUSOL Organics! Your order has been registered.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#7f6b4f] text-white px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#685740] transition-colors"
          >
            Return to Shop
            <ArrowRight className="w-4 h-4" />
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Order timeline steps
  const steps = [
    { title: "Order Placed", desc: "Registered in system", done: true },
    { title: "Processing & Crafting", desc: "Being prepared at Accra hub", done: true },
    { title: "Out for Delivery", desc: "Assigned to Accra rider", done: order.orderStatus === "out_for_delivery" || order.orderStatus === "delivered" },
    { title: "Delivered", desc: "Arrived at destination", done: order.orderStatus === "delivered" },
  ];

  const whatsappMessage = encodeURIComponent(
    `Hello EUSOL Organics! I'm following up on my Order #${order.orderNumber}. Could you provide a quick status update?`
  );

  return (
    <div className="min-h-screen bg-[#f8f2e6] text-[#1f1b13]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-28 pb-24 md:pt-36">
        {/* Success Banner */}
        <div className="bg-white/90 border border-[#e7dcc4] rounded-3xl p-8 md:p-10 shadow-sm text-center mb-10">
          <div className="w-16 h-16 bg-[#efe8d7] rounded-full flex items-center justify-center text-[#7f6b4f] mx-auto mb-4 scale-110">
            <CheckCircle className="w-10 h-10" />
          </div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#7f6b4f] font-semibold mb-2">
            Akwaaba! Order Confirmed
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#1f1b13] mb-3">
            Thank you for your order!
          </h1>
          <p className="text-sm text-[#5a5041] max-w-lg mx-auto mb-4">
            We have received your order <strong>#{order.orderNumber}</strong>. Our team is preparing your organic botanicals for dispatch within Greater Accra.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#efe8d7] rounded-full text-xs font-bold text-[#7f6b4f]">
            <Clock className="w-3.5 h-3.5" />
            Estimated Dispatch: Same Day / Next Morning
          </div>
        </div>

        {/* Live Order Status Tracker */}
        <div className="bg-white/90 border border-[#e7dcc4] rounded-3xl p-6 md:p-8 shadow-sm mb-10">
          <h2 className="font-serif text-xl font-semibold text-[#1f1b13] mb-6 flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#7f6b4f]" />
            Live Delivery Status
          </h2>

          <div className="grid gap-6 sm:grid-cols-4 relative">
            {steps.map((st, idx) => (
              <div key={st.title} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-all ${
                    st.done
                      ? "bg-[#7f6b4f] text-white shadow"
                      : "bg-[#efe8d7] text-[#7f6b4f]/60 border border-[#e7dcc4]"
                  }`}
                >
                  {st.done ? <Check className="w-5 h-5" /> : idx + 1}
                </div>
                <div>
                  <p className="font-bold text-xs text-[#1f1b13]">{st.title}</p>
                  <p className="text-[11px] text-[#5a5041]">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details & Summary Breakdown */}
        <div className="grid gap-8 md:grid-cols-2 mb-10">
          {/* Items Purchased */}
          <div className="bg-white/90 border border-[#e7dcc4] rounded-3xl p-6 shadow-sm">
            <h3 className="font-serif text-lg font-semibold text-[#1f1b13] border-b border-[#e7dcc4] pb-4 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#7f6b4f]" />
              Items Ordered
            </h3>
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="w-14 h-14 bg-[#efe8d7] rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1f1b13] truncate">{item.name}</p>
                    <p className="text-[11px] text-[#5a5041]">
                      Qty: {item.quantity} {item.weight ? `• ${item.weight}` : ""}
                    </p>
                  </div>
                  <p className="text-xs font-bold text-[#7f6b4f]">
                    GHS {item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-[#e7dcc4] pt-4 mt-4 space-y-2 text-xs text-[#5a5041]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>GHS {order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Greater Accra Delivery</span>
                <span>GHS {order.deliveryFee}</span>
              </div>
              <div className="flex justify-between text-sm font-serif font-bold text-[#1f1b13] border-t border-[#e7dcc4] pt-2">
                <span>Total Paid / Due</span>
                <span className="text-[#7f6b4f]">GHS {order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div className="bg-white/90 border border-[#e7dcc4] rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#1f1b13] border-b border-[#e7dcc4] pb-4 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#7f6b4f]" />
                Delivery Address
              </h3>
              <p className="font-bold text-xs text-[#1f1b13]">{order.customerInfo.fullName}</p>
              <p className="text-xs text-[#5a5041] mt-1">{order.customerInfo.address}</p>
              <p className="text-xs text-[#5a5041]">Area: {order.customerInfo.area}, Greater Accra</p>
              {order.customerInfo.landmark && (
                <p className="text-xs text-[#5a5041]/80 italic mt-1">
                  Landmark: {order.customerInfo.landmark}
                </p>
              )}
              <p className="text-xs text-[#5a5041] mt-1">Phone: {order.customerInfo.phone}</p>
            </div>

            <div>
              <h3 className="font-serif text-lg font-semibold text-[#1f1b13] border-b border-[#e7dcc4] pb-4 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#7f6b4f]" />
                Payment Summary
              </h3>
              <p className="text-xs text-[#5a5041]">
                Method:{" "}
                <strong className="text-[#1f1b13] capitalize">
                  {order.paymentMethod === "paystack"
                    ? "Paystack (Paid Online)"
                    : order.paymentMethod === "cod"
                    ? "Payment on Delivery (Cash/MoMo)"
                    : "WhatsApp Order"}
                </strong>
              </p>
              <p className="text-xs text-[#5a5041] mt-1">
                Payment Status:{" "}
                <span
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </p>
              {order.paymentReference && (
                <p className="text-[11px] text-[#5a5041]/70 mt-1">Ref: {order.paymentReference}</p>
              )}
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/233540996909?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs hover:brightness-105 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Dispatch via WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#7f6b4f] text-white px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#685740] transition-colors"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
