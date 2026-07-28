"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { Product, ProductMedia } from "@/lib/types";
import { Check, Sparkles, Shield } from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts?: Product[];
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem, openCart } = useCart();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const mediaGallery: ProductMedia[] = useMemo(() => {
    if (product.media && product.media.length > 0) {
      return product.media;
    }

    return [
      {
        id: `${product.id}-fallback`,
        type: 'image',
        url: product.image,
        altText: product.name,
        isPrimary: true,
        uploadedAt: new Date(),
        fileName: product.image,
      },
    ];
  }, [product.image, product.media, product.id, product.name]);

  const activeMedia = mediaGallery[selectedIndex];
  const isVideo = activeMedia.type === 'video';

  const isOutOfStock =
    product.inStock === false ||
    (typeof product.stockQuantity === "number" && product.stockQuantity <= 0);

  const handleWhatsAppOrder = () => {
    if (isOutOfStock) return;
    const message = `Hello EUSOL ORGANICS!\n\nI would like to order:\n- ${product.name} (1x) - ${product.currency}${product.price}\n\nPlease confirm availability for Greater Accra delivery.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/233540996909?text=${encodedMessage}`, "_blank");
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product);
    setIsAdded(true);
    openCart();
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <main className="bg-[#f8f2e6] text-[#1f1b13]">
      <div className="max-w-screen-2xl mx-auto px-6 py-12 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[36px] border border-[#ded1b6] bg-white shadow-[0_24px_80px_rgba(20,20,20,0.08)] relative">
              <div className="relative aspect-[4/5] bg-[#f7f0e4]">
                {isVideo ? (
                  <video
                    src={activeMedia.url}
                    muted
                    autoPlay
                    playsInline
                    loop
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={activeMedia.url}
                    alt={activeMedia.altText}
                    fill
                    className={`object-cover ${isOutOfStock ? "opacity-75 grayscale-[25%]" : ""}`}
                    unoptimized
                  />
                )}
              </div>
              {isOutOfStock && (
                <div className="absolute top-6 right-6 rounded-full bg-red-700 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-md">
                  Out of Stock
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {mediaGallery.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`relative aspect-square overflow-hidden rounded-3xl border transition ${
                    selectedIndex === index
                      ? 'border-[#8b6b45] ring-2 ring-[#8b6b45]/20'
                      : 'border-[#e4d9c1]'
                  }`}
                >
                  {item.type === 'video' ? (
                    <video src={item.url} muted className="h-full w-full object-cover" />
                  ) : (
                    <Image src={item.url} alt={item.altText} fill className="object-cover" unoptimized />
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-[#5e4d3d]">
                    {item.type}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.35em] text-[#7f6b4f]">
                {product.category}
              </p>
              <h1 className="text-4xl font-serif font-semibold leading-tight text-[#1f1b13] sm:text-5xl">
                {product.name}
              </h1>
              <p className="text-3xl font-serif text-[#7f6b3f]">
                {product.currency} {product.price}
              </p>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-block px-3 py-1 text-xs uppercase tracking-[0.25em] font-bold rounded-full ${
                    isOutOfStock
                      ? "bg-red-100 text-red-800 border border-red-200"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  {isOutOfStock
                    ? "Out of Stock"
                    : typeof product.stockQuantity === "number"
                    ? `In Stock (${product.stockQuantity} available)`
                    : "In Stock"}
                </span>
              </div>
            </div>

            <div className="rounded-[32px] border border-[#ded1b6] bg-white p-8 shadow-sm">
              <p className="text-base leading-8 text-[#4f4639]">
                {product.longDescription || product.description}
              </p>
            </div>

            {product.healthBenefits?.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {product.healthBenefits.map((benefit, idx) => (
                  <div key={idx} className="rounded-[28px] border border-[#e6dcc3] bg-white p-5 text-sm text-[#4f4639] shadow-sm">
                    {benefit}
                  </div>
                ))}
              </div>
            ) : null}

            <div className="space-y-4">
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                disabled={isOutOfStock}
                className={`w-full rounded-[28px] px-6 py-4 text-sm font-semibold uppercase tracking-[0.28em] transition ${
                  isOutOfStock
                    ? "bg-[#d8cebe] text-[#8c806f] cursor-not-allowed"
                    : "bg-[#7f6b4f] text-white hover:bg-[#634f39]"
                }`}
              >
                {isOutOfStock ? "Unavailable via WhatsApp" : "Order via WhatsApp"}
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full rounded-[28px] border px-6 py-4 text-sm font-semibold uppercase tracking-[0.28em] transition ${
                  isOutOfStock
                    ? "border-[#d8cebe] bg-[#efe8d7]/50 text-[#8c806f] cursor-not-allowed"
                    : "border-[#8b6b45] bg-white text-[#1f1b13] hover:bg-[#f7f1e4]"
                }`}
              >
                {isOutOfStock ? (
                  "Out of Stock"
                ) : isAdded ? (
                  <span className="inline-flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#7f6b4f]" /> Added to Cart
                  </span>
                ) : (
                  'Add to Ritual Cart'
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-[32px] border border-[#e6dcc3] bg-white p-6 text-sm text-[#4f4639] shadow-sm">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-[#7f6b4f]" />
                <span>{product.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-[#7f6b4f]" />
                <span>{!isOutOfStock ? 'Fresh stock' : 'Out of stock'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
