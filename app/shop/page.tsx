"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { products as localProducts } from "@/lib/data";
import { fetchProducts } from "@/lib/firestore";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import WhatsAppButton from "@/components/whatsapp-button";
import { Leaf, Quote } from "lucide-react";

const categories = ["All", "Seeds", "Powders", "Herbal Products"];

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get?.("category") ?? null;

  const [products, setProducts] = useState(localProducts);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [priceRange, setPriceRange] = useState(500);

  useEffect(() => {
    fetchProducts()
      .then((remoteProducts) => {
        if (remoteProducts.length > 0) {
          setProducts(remoteProducts);
        }
      })
      .catch((error) => {
        console.error('Failed to load Firestore products:', error);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes("All") ||
        selectedCategories.includes(product.category);
      const priceMatch = product.price <= priceRange;
      return categoryMatch && priceMatch;
    });
  }, [products, selectedCategories, priceRange]);

  const toggleCategory = (category: string) => {
    if (category === "All") {
      setSelectedCategories([]);
      return;
    }
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev.filter((c) => c !== "All"), category]
    );
  };

  return (
    <>
      <header className="mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <span className="font-sans text-secondary uppercase tracking-[0.3em] text-sm mb-3 block">
            Eusol Organics Collection
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif tracking-tight text-primary leading-tight">
            Nature&apos;s Potent <br /> Apothecary
          </h1>
        </div>
        <div className="hidden md:block pb-2">
          <p className="font-sans text-on-surface-variant max-w-xs text-sm leading-relaxed">
            A curated archive of botanical excellence, harvested with intention and distilled through centuries of Ghanaian heritage.
          </p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="lg:sticky lg:top-28 space-y-8 md:space-y-10">
            <div>
              <h3 className="font-serif text-xl mb-5 md:mb-6 text-primary">
                Categories
              </h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center group cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={
                        category === "All"
                          ? selectedCategories.length === 0
                          : selectedCategories.includes(category)
                      }
                      onChange={() => toggleCategory(category)}
                      className="w-4 h-4 rounded border-outline text-primary focus:ring-primary-container accent-secondary"
                    />
                    <span
                      className={`ml-3 font-sans text-sm transition-colors ${
                        selectedCategories.includes(category) ||
                        (category === "All" && selectedCategories.length === 0)
                          ? "text-primary font-bold"
                          : "text-on-surface-variant group-hover:text-primary"
                      }`}
                    >
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-serif text-xl mb-5 md:mb-6 text-primary">
                Price Range
              </h3>
              <div className="px-2">
                <input
                  type="range"
                  min="10"
                  max="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary"
                />
                <div className="flex justify-between mt-3 font-sans text-xs text-on-surface-variant">
                  <span>GHS 10</span>
                  <span>GHS {priceRange}+</span>
                </div>
              </div>
            </div>

            <div className="bg-primary-container p-5 md:p-6 rounded-lg text-on-primary relative overflow-hidden hidden lg:block">
              <div className="relative z-10">
                <p className="font-serif text-lg mb-2">Artisan Consultation</p>
                <p className="font-sans text-xs opacity-80 mb-4 leading-relaxed">
                  Personalized herbal wisdom tailored to your vitality profile.
                </p>
                <Link
                  href="/contact"
                  className="text-xs uppercase tracking-widest font-bold border-b border-on-primary pb-1 hover:text-white transition-colors"
                >
                  Discover More
                </Link>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Leaf className="w-24 h-24" />
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-grow">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-xl text-primary/60 mb-4">
                No products match your filters
              </p>
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setPriceRange(500);
                }}
                className="text-secondary font-bold text-sm uppercase tracking-wider border-b border-secondary pb-1"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <WhatsAppButton />

      <main className="pt-24 md:pt-32 pb-20">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-8">
          <Suspense fallback={<div className="py-20 text-center text-sm font-serif">Loading collection...</div>}>
            <ShopContent />
          </Suspense>
        </div>

        <section className="bg-surface-container-low py-20 md:py-24 mt-20 md:mt-24">
          <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
            <Quote className="text-secondary text-4xl md:text-5xl mx-auto mb-6 md:mb-8" />
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-primary italic leading-tight mb-6 md:mb-8">
              &ldquo;The Heritage of Healing is not found in a laboratory, but in the rhythm of the soil and the memory of the elders who tended it before us.&rdquo;
            </h2>
            <div className="w-16 h-0.5 bg-secondary mx-auto mb-4" />
            <p className="font-sans text-on-surface-variant uppercase tracking-[0.2em] text-xs md:text-sm">
              Philosophies of Eusol Organics
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
