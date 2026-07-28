"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  region: string;
  area?: string;
  address?: string;
  landmark?: string;
}

interface SupabaseAuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch or create user profile from Supabase
  const fetchProfile = async (u: User) => {
    if (!isSupabaseConfigured()) {
      const fallback: UserProfile = {
        id: u.id,
        fullName: u.user_metadata?.full_name || u.email?.split("@")[0] || "Valued Client",
        phone: u.user_metadata?.phone || "",
        email: u.email || "",
        region: "Greater Accra",
      };
      setProfile(fallback);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", u.id)
        .single();

      if (data && !error) {
        setProfile({
          id: data.id,
          fullName: data.full_name || u.user_metadata?.full_name || "",
          phone: data.phone || u.user_metadata?.phone || "",
          email: data.email || u.email || "",
          region: data.region || "Greater Accra",
          area: data.area || "",
          address: data.address || "",
          landmark: data.landmark || "",
        });
      } else {
        // Create initial profile
        const newProf: UserProfile = {
          id: u.id,
          fullName: u.user_metadata?.full_name || u.email?.split("@")[0] || "Valued Client",
          phone: u.user_metadata?.phone || "",
          email: u.email || "",
          region: "Greater Accra",
        };
        await supabase.from("profiles").upsert({
          id: u.id,
          full_name: newProf.fullName,
          phone: newProf.phone,
          email: newProf.email,
          region: "Greater Accra",
        });
        setProfile(newProf);
      }
    } catch (err) {
      console.warn("Profile fetch warning:", err);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        fetchProfile(currentSession.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          await fetchProfile(currentSession.user);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    if (!isSupabaseConfigured()) {
      return { error: "Supabase credentials are not configured in .env.local" };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
          },
        },
      });

      if (error) return { error: error.message };

      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name: fullName,
          phone,
          email,
          region: "Greater Accra",
        });
      }

      return { error: null };
    } catch (err: unknown) {
      return { error: (err as Error).message || "Sign up failed" };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { error: "Supabase credentials are not configured in .env.local" };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error: error.message };
      return { error: null };
    } catch (err: unknown) {
      return { error: (err as Error).message || "Sign in failed" };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;

    const updated = {
      ...(profile || {
        id: user.id,
        fullName: "",
        phone: "",
        email: user.email || "",
        region: "Greater Accra",
      }),
      ...data,
    };
    setProfile(updated);

    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: updated.fullName,
        phone: updated.phone,
        email: updated.email,
        region: "Greater Accra",
        area: updated.area,
        address: updated.address,
        landmark: updated.landmark,
        updated_at: new Date().toISOString(),
      });

      return !error;
    } catch (err) {
      console.error("Error updating profile:", err);
      return false;
    }
  };

  return (
    <SupabaseAuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error("useSupabaseAuth must be used within a SupabaseAuthProvider");
  }
  return context;
}
