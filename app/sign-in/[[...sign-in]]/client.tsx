"use client";

import { useEffect } from "react";

export default function SignInClient() {
  useEffect(() => {
    window.location.href = "/";
  }, []);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-surface px-4">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-bold italic text-primary mb-4">
          EUSOL ORGANICS
        </h1>
        <p className="text-on-surface-variant text-sm mb-8">
          Redirecting to homepage...
        </p>
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
}
