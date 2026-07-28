"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSupabaseAuth } from "@/lib/supabase-auth-context";
import { useCart } from "@/lib/cart-context";
import { Search, ShoppingBasket, Menu, X, User, LogOut } from "lucide-react";
import AuthModal from "@/components/auth-modal";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop All" },
  { href: "/account", label: "My Orders" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { user, profile, signOut } = useSupabaseAuth();
  const { totalItems, openCart } = useCart();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-surface/90 backdrop-blur-xl shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <h1 className="font-serif text-xl md:text-2xl font-bold text-primary italic">
                EUSOL ORGANICS
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-widest font-medium transition-colors duration-300 pb-1 ${
                    isActive(link.href)
                      ? "text-secondary border-b-2 border-secondary"
                      : "text-primary/70 hover:text-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4 md:space-x-6">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-primary/70 hover:text-secondary transition-colors hidden sm:block"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative text-primary/70 hover:text-secondary transition-colors"
                aria-label="Open cart"
              >
                <ShoppingBasket className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Account Link */}
              <div className="hidden sm:flex items-center gap-3">
                {user ? (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/account"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1f1b13] hover:text-[#7f6b4f] transition-colors"
                    >
                      <User className="w-4 h-4 text-[#7f6b4f]" />
                      <span>{profile?.fullName || "Account"}</span>
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="text-xs text-[#5a5041]/70 hover:text-red-600 transition-colors p-1"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7f6b4f] hover:text-[#5a4833] transition-colors px-3 py-1.5 rounded-lg border border-[#e7dcc4] hover:bg-[#efe8d7]"
                  >
                    <User className="w-3.5 h-3.5" />
                    Sign In
                  </button>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-primary/70 hover:text-secondary transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-outline-variant/20 bg-surface/95 backdrop-blur-xl px-6 py-4 animate-in slide-in-from-top-2">
            <div className="max-w-screen-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-secondary focus:ring-0 pl-8 py-2 text-sm placeholder:text-primary/30"
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-primary/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-16 left-0 right-0 bg-surface shadow-xl border-t border-outline-variant/20">
            <nav className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm uppercase tracking-widest font-medium py-2 ${
                    isActive(link.href)
                      ? "text-secondary"
                      : "text-primary/70"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-outline-variant/20">
                {user ? (
                  <div className="flex items-center justify-between">
                    <Link
                      href="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-sm font-bold text-primary flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-[#7f6b4f]" />
                      {profile?.fullName || "My Account"}
                    </Link>
                    <button
                      onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                      className="text-xs text-red-600 font-bold uppercase tracking-wider"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                    className="w-full bg-[#7f6b4f] text-white py-3 rounded-lg text-sm font-bold uppercase tracking-widest"
                  >
                    Login / Sign Up
                  </button>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
