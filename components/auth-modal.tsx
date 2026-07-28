"use client";

import React, { useState } from "react";
import { useSupabaseAuth } from "@/lib/supabase-auth-context";
import { X, Lock, Mail, User, Phone, CheckCircle, AlertCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialMode = "signin" }: AuthModalProps) {
  const { signIn, signUp } = useSupabaseAuth();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === "signin") {
      const res = await signIn(email, password);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg("Logged in successfully!");
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } else {
      if (!fullName.trim() || !phone.trim()) {
        setErrorMsg("Please provide your full name and Ghanaian phone number.");
        setLoading(false);
        return;
      }
      const res = await signUp(email, password, fullName, phone);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg("Account created! Check your email to confirm registration or log in.");
        setTimeout(() => {
          setMode("signin");
        }, 2000);
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1f1b13]/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-[#f8f2e6] border border-[#e7dcc4] rounded-3xl shadow-2xl max-w-md w-full p-8 md:p-10 animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-[#5a5041] hover:bg-[#efe8d7] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Branding & Tabs */}
        <div className="text-center mb-6">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#7f6b4f] font-semibold mb-1">
            EUSOL Organics Portal
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#1f1b13]">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#e7dcc4] mb-6">
          <button
            type="button"
            onClick={() => { setMode("signin"); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              mode === "signin"
                ? "text-[#7f6b4f] border-b-2 border-[#7f6b4f]"
                : "text-[#5a5041]/60 hover:text-[#1f1b13]"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode("signup"); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              mode === "signup"
                ? "text-[#7f6b4f] border-b-2 border-[#7f6b4f]"
                : "text-[#5a5041]/60 hover:text-[#1f1b13]"
            }`}
          >
            Register
          </button>
        </div>

        {/* Alert Notifications */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#1f1b13] mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#7f6b4f] absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abena Mensah"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#e7dcc4] rounded-xl text-xs text-[#1f1b13] focus:outline-none focus:border-[#7f6b4f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f1b13] mb-1">Phone Number (Ghana)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#7f6b4f] absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0244123456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#e7dcc4] rounded-xl text-xs text-[#1f1b13] focus:outline-none focus:border-[#7f6b4f]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1f1b13] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#7f6b4f] absolute left-3 top-3.5" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#e7dcc4] rounded-xl text-xs text-[#1f1b13] focus:outline-none focus:border-[#7f6b4f]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1f1b13] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7f6b4f] absolute left-3 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#e7dcc4] rounded-xl text-xs text-[#1f1b13] focus:outline-none focus:border-[#7f6b4f]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7f6b4f] text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#685740] transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : mode === "signin" ? "Sign In" : "Register Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
