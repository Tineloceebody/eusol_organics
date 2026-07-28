"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useCart } from "@/lib/cart-context";
import { useSupabaseAuth } from "@/lib/supabase-auth-context";
import { CustomerInfo, GreaterAccraArea, PaymentMethod, Order } from "@/lib/types";
import { createOrder } from "@/lib/db";
import { generateOrderNumber, loadPaystackScript, PAYSTACK_PUBLIC_KEY } from "@/lib/paystack";
import {
  MapPin,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Building2,
  Phone,
  User,
  Mail,
  FileText,
  Lock,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

// Greater Accra Area fees in GHS
const ACCRA_AREAS: { area: GreaterAccraArea; fee: number; estTime: string }[] = [
  { area: "East Legon", fee: 25, estTime: "Same Day (3 - 5 hrs)" },
  { area: "Osu / Cantonments / Labone", fee: 20, estTime: "Same Day (2 - 4 hrs)" },
  { area: "Airport Residential / Dzorwulu", fee: 20, estTime: "Same Day (2 - 4 hrs)" },
  { area: "Accra Central / Ridge", fee: 20, estTime: "Same Day (2 - 4 hrs)" },
  { area: "Spintex / Batsonaa", fee: 30, estTime: "Same Day / Next Morning" },
  { area: "Madina / Adenta", fee: 30, estTime: "Same Day / Next Morning" },
  { area: "Achimota / Dome", fee: 25, estTime: "Same Day (3 - 5 hrs)" },
  { area: "Lapaz / Abeka", fee: 25, estTime: "Same Day (3 - 5 hrs)" },
  { area: "Dansoman / Korle Bu", fee: 25, estTime: "Same Day (3 - 5 hrs)" },
  { area: "Haatso / Atomic", fee: 30, estTime: "Same Day / Next Morning" },
  { area: "Tema (Community 1-25)", fee: 35, estTime: "Next Day Delivery" },
  { area: "Sakumono / Lashibi", fee: 35, estTime: "Next Day Delivery" },
  { area: "Other Greater Accra Location", fee: 35, estTime: "Same Day / Next Day" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, profile } = useSupabaseAuth();
  const { items, totalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  // Form State
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: profile?.fullName || "",
    phone: profile?.phone || "",
    email: profile?.email || user?.email || "",
    region: "Greater Accra",
    area: (profile?.area as GreaterAccraArea) || "East Legon",
    address: profile?.address || "",
    landmark: profile?.landmark || "",
    notes: "",
  });

  useEffect(() => {
    if (profile) {
      setCustomerInfo((prev) => ({
        ...prev,
        fullName: profile.fullName || prev.fullName,
        phone: profile.phone || prev.phone,
        email: profile.email || user?.email || prev.email,
        area: (profile.area as GreaterAccraArea) || prev.area,
        address: profile.address || prev.address,
        landmark: profile.landmark || prev.landmark,
      }));
    }
  }, [profile, user?.email]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paystack");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadPaystackScript().then((loaded) => setPaystackLoaded(loaded));
  }, []);

  const selectedAreaObj = ACCRA_AREAS.find((a) => a.area === customerInfo.area) || ACCRA_AREAS[0];
  const deliveryFee = selectedAreaObj.fee;
  const grandTotal = totalPrice + deliveryFee;

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!customerInfo.fullName.trim()) errs.fullName = "Full name is required";
    if (!customerInfo.phone.trim()) {
      errs.phone = "Phone number is required for delivery & MoMo";
    } else if (customerInfo.phone.trim().length < 9) {
      errs.phone = "Enter a valid Ghanaian phone number (e.g. 024XXXXXXX)";
    }
    if (!customerInfo.email.trim() || !customerInfo.email.includes("@")) {
      errs.email = "Valid email address is required";
    }
    if (!customerInfo.address.trim()) {
      errs.address = "Street address or digital address (GH Post) is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const processOrderCreation = async (
    paymentStatus: "pending" | "paid",
    reference?: string
  ) => {
    setIsSubmitting(true);

    try {
      const orderNumber = generateOrderNumber();
      const orderData: Omit<Order, "id" | "createdAt"> = {
        orderNumber,
        userId: user?.id || undefined,
        customerInfo,
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          weight: item.product.weight,
          image: item.product.image,
        })),
        subtotal: totalPrice,
        deliveryFee,
        totalAmount: grandTotal,
        currency: "GHS",
        paymentMethod,
        paymentStatus,
        paymentReference: reference || undefined,
        orderStatus: "placed",
      };

      const created = await createOrder(orderData);
      clearCart();
      router.push(`/checkout/success/${created.id}`);
    } catch (err) {
      console.error("Order processing error:", err);
      alert("There was an issue creating your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleFinalOrderSubmit = () => {
    if (items.length === 0) return;

    if (paymentMethod === "cod") {
      // Payment on Delivery
      processOrderCreation("pending");
    } else if (paymentMethod === "whatsapp") {
      // Direct WhatsApp Order
      const itemMsg = items
        .map((i) => `- ${i.product.name} (${i.quantity}x) - GHS${i.product.price * i.quantity}`)
        .join("\n");
      const text = encodeURIComponent(
        `Hello EUSOL Organics!\n\nI want to place an order for Greater Accra delivery:\n\n${itemMsg}\n\nDelivery Area: ${customerInfo.area}\nAddress: ${customerInfo.address}\nContact: ${customerInfo.fullName} (${customerInfo.phone})\nTotal Amount: GHS ${grandTotal}\n\nPlease confirm order!`
      );
      processOrderCreation("pending");
      window.open(`https://wa.me/233540996909?text=${text}`, "_blank");
    } else if (paymentMethod === "paystack") {
      // Paystack Online Payment
      const win = typeof window !== "undefined" ? (window as unknown as { PaystackPop?: { setup: (config: unknown) => { openIframe: () => void } } }) : {};
      if (!win.PaystackPop) {
        alert("Paystack modal is loading (or " + (paystackLoaded ? "ready" : "initializing") + "). Please check your internet connection and try again.");
        return;
      }

      const orderRef = generateOrderNumber();

      const handler = win.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: customerInfo.email,
        amount: grandTotal * 100, // Amount in pesewas
        currency: "GHS",
        ref: orderRef,
        metadata: {
          custom_fields: [
            { display_name: "Customer Name", variable_name: "customer_name", value: customerInfo.fullName },
            { display_name: "Phone Number", variable_name: "phone_number", value: customerInfo.phone },
            { display_name: "Accra Area", variable_name: "accra_area", value: customerInfo.area },
          ],
        },
        callback: function (response: { reference: string }) {
          processOrderCreation("paid", response.reference);
        },
        onClose: function () {
          setIsSubmitting(false);
          alert("Payment window closed. You can retry payment or choose Payment on Delivery.");
        },
      });

      handler.openIframe();
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f2e6] text-[#1f1b13]">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-32 text-center">
          <ShoppingBag className="w-16 h-16 text-[#7f6b4f]/40 mx-auto mb-6" />
          <h1 className="font-serif text-3xl font-semibold text-[#1f1b13] mb-4">
            Your Basket is Empty
          </h1>
          <p className="text-[#5a5041] mb-8">
            You need to add items to your cart before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#7f6b4f] text-white px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#685740] transition-colors"
          >
            Explore Botanicals
            <ArrowRight className="w-4 h-4" />
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f2e6] text-[#1f1b13]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-28 pb-24 md:pt-36">
        {/* Header & Steps Indicator */}
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#7f6b4f] font-semibold mb-2">
            Greater Accra Delivery Express
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#1f1b13] mb-8">
            Secure Ritual Checkout
          </h1>

          {/* Stepper Bar */}
          <div className="max-w-xl mx-auto flex items-center justify-between relative mb-8">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#e7dcc4] -translate-y-1/2 -z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-[#7f6b4f] -translate-y-1/2 transition-all duration-300 -z-0"
              style={{
                width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
              }}
            />

            {/* Step 1 Circle */}
            <div
              onClick={() => setCurrentStep(1)}
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer transition-all ${
                currentStep >= 1
                  ? "bg-[#7f6b4f] text-white shadow-md scale-105"
                  : "bg-white text-[#7f6b4f] border border-[#e7dcc4]"
              }`}
            >
              1
            </div>

            {/* Step 2 Circle */}
            <div
              onClick={() => validateStep1() && setCurrentStep(2)}
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer transition-all ${
                currentStep >= 2
                  ? "bg-[#7f6b4f] text-white shadow-md scale-105"
                  : "bg-white text-[#7f6b4f] border border-[#e7dcc4]"
              }`}
            >
              2
            </div>

            {/* Step 3 Circle */}
            <div
              onClick={() => validateStep1() && setCurrentStep(3)}
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer transition-all ${
                currentStep === 3
                  ? "bg-[#7f6b4f] text-white shadow-md scale-105"
                  : "bg-white text-[#7f6b4f] border border-[#e7dcc4]"
              }`}
            >
              3
            </div>
          </div>

          <div className="flex justify-between text-xs uppercase tracking-widest text-[#7f6b4f] font-semibold max-w-xl mx-auto px-2">
            <span>Location</span>
            <span>Payment</span>
            <span>Review</span>
          </div>
        </div>

        {/* Checkout Main Content Grid */}
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] items-start">
          {/* Left Column: Step Form */}
          <div className="bg-white/90 border border-[#e7dcc4] rounded-3xl p-6 md:p-8 shadow-sm">
            {/* STEP 1: Delivery Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3 border-b border-[#e7dcc4] pb-4 mb-6">
                  <div className="p-2.5 bg-[#efe8d7] rounded-xl text-[#7f6b4f]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-[#1f1b13]">
                      Delivery Location & Contact
                    </h2>
                    <p className="text-xs text-[#5a5041]">
                      Currently serving all neighborhoods across Greater Accra.
                    </p>
                  </div>
                </div>

                {/* Region Badge Restriction */}
                <div className="p-4 bg-[#efe8d7]/60 border border-[#e7dcc4] rounded-2xl flex items-center gap-3 text-xs font-semibold text-[#7f6b4f]">
                  <Building2 className="w-4 h-4 flex-shrink-0" />
                  <span>Region: <strong>Greater Accra Region</strong> (Direct Dispatch)</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5a5041] mb-2 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#7f6b4f]" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Abena Mensah"
                      value={customerInfo.fullName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-[#1f1b13] focus:outline-none focus:ring-2 focus:ring-[#7f6b4f] ${
                        errors.fullName ? "border-red-500" : "border-[#e7dcc4]"
                      }`}
                    />
                    {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5a5041] mb-2 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#7f6b4f]" />
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 0244123456"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-[#1f1b13] focus:outline-none focus:ring-2 focus:ring-[#7f6b4f] ${
                        errors.phone ? "border-red-500" : "border-[#e7dcc4]"
                      }`}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5a5041] mb-2 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#7f6b4f]" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. abena@example.com"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-[#1f1b13] focus:outline-none focus:ring-2 focus:ring-[#7f6b4f] ${
                      errors.email ? "border-red-500" : "border-[#e7dcc4]"
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* Greater Accra Area Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5a5041] mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#7f6b4f]" />
                    Select Greater Accra Area *
                  </label>
                  <select
                    value={customerInfo.area}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, area: e.target.value as GreaterAccraArea })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#e7dcc4] bg-white text-sm text-[#1f1b13] focus:outline-none focus:ring-2 focus:ring-[#7f6b4f]"
                  >
                    {ACCRA_AREAS.map((a) => (
                      <option key={a.area} value={a.area}>
                        {a.area} — GHS {a.fee} ({a.estTime})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5a5041] mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#7f6b4f]" />
                    Street Address / House / Digital Address (GhanaPost) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GA-123-4567, 14 Lagos Avenue, East Legon"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-[#1f1b13] focus:outline-none focus:ring-2 focus:ring-[#7f6b4f] ${
                      errors.address ? "border-red-500" : "border-[#e7dcc4]"
                    }`}
                  />
                  {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5a5041] mb-2">
                    Nearest Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Opposite Shell Filling Station / Near Ancora Hospital"
                    value={customerInfo.landmark || ""}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, landmark: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#e7dcc4] bg-white text-sm text-[#1f1b13] focus:outline-none focus:ring-2 focus:ring-[#7f6b4f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5a5041] mb-2">
                    Delivery Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Call before arrival or leave with security at the main gate"
                    value={customerInfo.notes || ""}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#e7dcc4] bg-white text-sm text-[#1f1b13] focus:outline-none focus:ring-2 focus:ring-[#7f6b4f]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full mt-4 bg-[#7f6b4f] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#685740] transition-colors flex items-center justify-center gap-2"
                >
                  Continue to Payment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: Payment Method */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3 border-b border-[#e7dcc4] pb-4 mb-6">
                  <div className="p-2.5 bg-[#efe8d7] rounded-xl text-[#7f6b4f]">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-[#1f1b13]">
                      Choose Payment Method
                    </h2>
                    <p className="text-xs text-[#5a5041]">
                      Select how you would like to pay for your organic order.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Paystack Online Payment */}
                  <label
                    onClick={() => setPaymentMethod("paystack")}
                    className={`block p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "paystack"
                        ? "border-[#7f6b4f] bg-[#efe8d7]/40 shadow-sm"
                        : "border-[#e7dcc4] bg-white hover:border-[#7f6b4f]/40"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === "paystack"
                              ? "border-[#7f6b4f] bg-[#7f6b4f]"
                              : "border-[#7f6b4f]/30"
                          }`}
                        >
                          {paymentMethod === "paystack" && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#1f1b13] flex items-center gap-2">
                            Pay Online with Paystack
                            <span className="px-2 py-0.5 bg-[#7f6b4f]/10 text-[#7f6b4f] text-[10px] uppercase font-bold rounded">
                              Recommended
                            </span>
                          </p>
                          <p className="text-xs text-[#5a5041] mt-1">
                            MTN Mobile Money, Telecel Cash, AirtelTigo Money, Visa & MasterCard.
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Payment on Delivery (COD) */}
                  <label
                    onClick={() => setPaymentMethod("cod")}
                    className={`block p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-[#7f6b4f] bg-[#efe8d7]/40 shadow-sm"
                        : "border-[#e7dcc4] bg-white hover:border-[#7f6b4f]/40"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === "cod"
                              ? "border-[#7f6b4f] bg-[#7f6b4f]"
                              : "border-[#7f6b4f]/30"
                          }`}
                        >
                          {paymentMethod === "cod" && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#1f1b13]">
                            Payment on Delivery (Cash or MoMo on Arrival)
                          </p>
                          <p className="text-xs text-[#5a5041] mt-1">
                            Pay in cash or transfer via Mobile Money directly to the dispatch rider upon receiving your order in Accra.
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* WhatsApp Direct Order */}
                  <label
                    onClick={() => setPaymentMethod("whatsapp")}
                    className={`block p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "whatsapp"
                        ? "border-[#7f6b4f] bg-[#efe8d7]/40 shadow-sm"
                        : "border-[#e7dcc4] bg-white hover:border-[#7f6b4f]/40"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === "whatsapp"
                              ? "border-[#7f6b4f] bg-[#7f6b4f]"
                              : "border-[#7f6b4f]/30"
                          }`}
                        >
                          {paymentMethod === "whatsapp" && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#1f1b13]">
                            Order & Confirm via WhatsApp
                          </p>
                          <p className="text-xs text-[#5a5041] mt-1">
                            Instantly sends your itemized order details to our Accra WhatsApp sales desk for personalized confirmation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-1/3 py-4 rounded-xl border border-[#7f6b4f] text-[#7f6b4f] font-bold uppercase tracking-widest text-xs hover:bg-[#efe8d7] transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-2/3 bg-[#7f6b4f] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#685740] transition-colors flex items-center justify-center gap-2"
                  >
                    Review Order
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Review & Place Order */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3 border-b border-[#e7dcc4] pb-4 mb-6">
                  <div className="p-2.5 bg-[#efe8d7] rounded-xl text-[#7f6b4f]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-[#1f1b13]">
                      Final Order Review
                    </h2>
                    <p className="text-xs text-[#5a5041]">
                      Please confirm your delivery address and payment choice.
                    </p>
                  </div>
                </div>

                {/* Delivery Review Card */}
                <div className="bg-[#efe8d7]/40 p-5 rounded-2xl border border-[#e7dcc4] space-y-2 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-[#e7dcc4]/60">
                    <span className="font-bold uppercase tracking-wider text-[#7f6b4f]">
                      Delivery Address
                    </span>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-[#7f6b4f] underline hover:text-[#1f1b13]"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="font-bold text-sm text-[#1f1b13]">{customerInfo.fullName}</p>
                  <p className="text-[#5a5041]">
                    {customerInfo.address}, {customerInfo.area}, Greater Accra
                  </p>
                  {customerInfo.landmark && (
                    <p className="text-[#5a5041]/80 italic">Landmark: {customerInfo.landmark}</p>
                  )}
                  <p className="text-[#5a5041]">Phone: {customerInfo.phone}</p>
                </div>

                {/* Payment Review Card */}
                <div className="bg-[#efe8d7]/40 p-5 rounded-2xl border border-[#e7dcc4] space-y-2 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-[#e7dcc4]/60">
                    <span className="font-bold uppercase tracking-wider text-[#7f6b4f]">
                      Payment Selection
                    </span>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-[#7f6b4f] underline hover:text-[#1f1b13]"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="font-bold text-sm text-[#1f1b13] capitalize">
                    {paymentMethod === "paystack"
                      ? "Paystack (Mobile Money / Cards)"
                      : paymentMethod === "cod"
                      ? "Payment on Delivery (Cash / MoMo)"
                      : "WhatsApp Order Confirmation"}
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isSubmitting}
                    className="w-1/3 py-4 rounded-xl border border-[#7f6b4f] text-[#7f6b4f] font-bold uppercase tracking-widest text-xs hover:bg-[#efe8d7] transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalOrderSubmit}
                    disabled={isSubmitting}
                    className="w-2/3 bg-[#7f6b4f] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#685740] transition-colors flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      "Processing Order..."
                    ) : paymentMethod === "paystack" ? (
                      <>
                        <Lock className="w-4 h-4" />
                        Pay GHS {grandTotal} Now
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Place Order (GHS {grandTotal})
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary Sidebar */}
          <div className="bg-white/90 border border-[#e7dcc4] rounded-3xl p-6 shadow-sm sticky top-32 space-y-6">
            <h3 className="font-serif text-lg font-semibold text-[#1f1b13] border-b border-[#e7dcc4] pb-4">
              Ritual Basket Summary
            </h3>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 items-center">
                  <div className="w-14 h-14 bg-[#efe8d7] rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1f1b13] truncate">{item.product.name}</p>
                    <p className="text-[11px] text-[#5a5041]">
                      Qty: {item.quantity} • {item.product.weight || item.product.category}
                    </p>
                  </div>
                  <p className="text-xs font-bold text-[#7f6b4f]">
                    GHS {item.product.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-[#e7dcc4] pt-4 space-y-3 text-xs text-[#5a5041]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1f1b13]">GHS {totalPrice}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#7f6b4f]" />
                  Accra Dispatch ({selectedAreaObj.area})
                </span>
                <span className="font-semibold text-[#1f1b13]">GHS {deliveryFee}</span>
              </div>
              <div className="flex justify-between text-base font-serif font-bold text-[#1f1b13] border-t border-[#e7dcc4] pt-3">
                <span>Total Amount</span>
                <span className="text-[#7f6b4f]">GHS {grandTotal}</span>
              </div>
            </div>

            <div className="p-4 bg-[#efe8d7]/40 rounded-2xl border border-[#e7dcc4] text-[11px] text-[#5a5041] space-y-1.5">
              <p className="font-semibold text-[#1f1b13] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#7f6b4f]" />
                Greater Accra Dispatch Guarantee
              </p>
              <p>
                Orders within Greater Accra are dispatched promptly from our Accra hub. Estimated delivery: <strong>{selectedAreaObj.estTime}</strong>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
