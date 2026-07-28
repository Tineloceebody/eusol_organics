"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/lib/types";
import { Check, Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "featured" | "compact";
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const isOutOfStock =
    product.inStock === false ||
    (typeof product.stockQuantity === "number" && product.stockQuantity <= 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product);
    setIsAdded(true);
    openCart();
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group bg-white border border-[#e7dcc4] rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative">
      <div>
        {/* Compact Image Container (Square / Jumia-style) */}
        <div className="relative aspect-square bg-[#efe8d7]/40 rounded-xl overflow-hidden mb-2">
          <Link href={`/product/${product.id}`}>
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                isOutOfStock ? "opacity-75 grayscale-[25%]" : ""
              }`}
            />
          </Link>
          {product.badge && (
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#7f6b4f] text-white text-[9px] uppercase tracking-wider font-bold rounded-full shadow-sm">
              {product.badge}
            </span>
          )}
          {isOutOfStock && (
            <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-700 text-white text-[9px] uppercase tracking-wider font-bold rounded-full shadow-sm z-10">
              Out of Stock
            </span>
          )}
        </div>

        {/* Category & Weight */}
        <p className="text-[10px] uppercase tracking-wider font-semibold text-[#7f6b4f] mb-0.5">
          {product.category} {product.weight ? `• ${product.weight}` : ""}
        </p>

        {/* Product Name */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-sans text-xs sm:text-sm font-bold text-[#1f1b13] group-hover:text-[#7f6b4f] transition-colors line-clamp-2 min-h-[2rem] leading-tight">
            {product.name}
          </h3>
        </Link>
      </div>

      <div className="mt-2 pt-2 border-t border-[#e7dcc4]/60">
        {/* Price Tag */}
        <div className="flex items-center justify-between mb-2">
          <p className="font-serif text-sm sm:text-base font-bold text-[#7f6b4f]">
            {product.currency} {product.price}
          </p>
          {typeof product.stockQuantity === "number" && !isOutOfStock && (
            <span className="text-[10px] font-medium text-[#7f6b4f]/70">
              {product.stockQuantity} left
            </span>
          )}
        </div>

        {/* Compact Add to Cart or Out of Stock Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-2 px-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
            isOutOfStock
              ? "bg-[#e5ded0] text-[#918572] cursor-not-allowed"
              : isAdded
              ? "bg-green-700 text-white"
              : "bg-[#efe8d7] text-[#7f6b4f] hover:bg-[#7f6b4f] hover:text-white shadow-xs"
          }`}
        >
          {isOutOfStock ? (
            <span>Out of Stock</span>
          ) : isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
