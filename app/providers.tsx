"use client";

import { SupabaseAuthProvider } from "@/lib/supabase-auth-context";
import { CartProvider } from "@/lib/cart-context";
import { AdminProvider } from "@/lib/admin-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseAuthProvider>
      <AdminProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AdminProvider>
    </SupabaseAuthProvider>
  );
}
