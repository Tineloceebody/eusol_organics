'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/store/useCart';

export default function Header() {
  const { totalItems, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-[#e7dcc4] bg-white/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
        {/* Branding */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full text-[#7f6b4f]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M2 12h20M6 6l12 12M18 6L6 18" />
            </svg>
          </div>
          <span className="font-serif text-lg font-semibold text-[#1f1b13] group-hover:text-[#7f6b4f] transition">
            EUSOL
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden sm:flex items-center gap-8">
          <Link
            href="/shop"
            className="text-sm font-medium text-[#5a5041] hover:text-[#7f6b4f] transition"
          >
            Shop All
          </Link>
          <Link
            href="/shop?category=Seeds"
            className="text-sm font-medium text-[#5a5041] hover:text-[#7f6b4f] transition"
          >
            Seeds
          </Link>
          <Link
            href="/shop?category=Powders"
            className="text-sm font-medium text-[#5a5041] hover:text-[#7f6b4f] transition"
          >
            Powders
          </Link>
        </nav>

        {/* Cart Icon */}
        <button
          onClick={openCart}
          className="relative p-2 text-[#5a5041] hover:text-[#7f6b4f] transition"
          aria-label="Open cart"
        >
          <ShoppingBag className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-[#7f6b4f] rounded-full">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
