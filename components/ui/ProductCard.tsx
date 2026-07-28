'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/store/useCart';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();

  const primaryImage = useMemo(() => {
    return (
      product.media?.find((item) => item.type === 'image')?.url ?? product.image
    );
  }, [product.image, product.media]);

  const hoverVideo = useMemo(() => {
    return product.media?.find((item) => item.type === 'video');
  }, [product.media]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block overflow-hidden rounded-[32px] border border-[#d8cbb0] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[5/6] overflow-hidden bg-[#f8f1e5]">
        {hoverVideo && isHovered ? (
          <video
            className="h-full w-full object-cover"
            muted
            playsInline
            autoPlay
            loop
            preload="metadata"
          >
            <source src={hoverVideo.url} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`object-cover transition-transform duration-700 ${
              !hoverVideo ? 'group-hover:scale-105' : ''
            }`}
            unoptimized
          />
        )}

        {hoverVideo && (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#524b3e] shadow-sm">
            Video
          </span>
        )}

        {/* Quick Add Button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#7f6b4f] text-white opacity-0 transition-all duration-300 hover:bg-[#634f39] group-hover:opacity-100"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-3 px-5 py-6">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8c7a5f]">
            {product.category}
          </span>
          <span className="text-sm font-semibold text-[#7a5f3f]">
            {product.currency} {product.price}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-serif font-semibold text-[#231f19] transition-colors group-hover:text-[#8b6242]">
            {product.name}
          </h3>
          <p className="text-sm leading-6 text-[#6d6457] line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center rounded-full border border-[#d8cbb0] bg-[#fbf4e7] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#7a5f3f]">
            View details
          </span>
        </div>
      </div>
    </Link>
  );
}
