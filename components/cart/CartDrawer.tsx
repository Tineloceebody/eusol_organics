'use client';

import Image from 'next/image';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/store/useCart';
import { generateWhatsAppOrder } from '@/utils/checkout';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } =
    useCart();

  const hasItems = items.length > 0;

  const handleCheckout = () => {
    if (!hasItems) return;
    const message = generateWhatsAppOrder(items, totalPrice);
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/233540996909?text=${encodedMessage}`, '_blank');
    closeCart();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e7dcc4] px-6 py-5">
          <h2 className="text-lg font-serif font-semibold text-[#1f1b13]">
            Your Cart
          </h2>
          <button
            onClick={closeCart}
            className="p-1.5 text-[#5a5041] hover:text-[#7f6b4f] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {hasItems ? (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 rounded-2xl border border-[#e7dcc4] bg-[#f8f2e6] p-4"
              >
                {/* Image */}
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#f0ebe2]">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="text-sm font-medium text-[#1f1b13]">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-[#5a5041]">
                      {item.product.currency} {item.product.price}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="inline-flex items-center justify-center w-6 h-6 rounded text-[#5a5041] hover:bg-[#e7dcc4] transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium text-[#1f1b13] w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="inline-flex items-center justify-center w-6 h-6 rounded text-[#5a5041] hover:bg-[#e7dcc4] transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="ml-auto p-1.5 text-[#5a5041] hover:text-[#d32f2f] transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div className="space-y-3">
                <p className="text-sm text-[#5a5041]">Your cart is empty</p>
                <button
                  onClick={closeCart}
                  className="text-xs font-semibold text-[#7f6b4f] hover:underline"
                >
                  Continue shopping
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {hasItems && (
          <div className="border-t border-[#e7dcc4] space-y-4 px-6 py-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#5a5041]">
                Subtotal
              </span>
              <span className="text-lg font-serif font-semibold text-[#1f1b13]">
                GHS {totalPrice.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-[#5a5041] leading-relaxed">
              You will complete your order via WhatsApp. Our team will confirm delivery costs and final details.
            </p>
            <button
              onClick={handleCheckout}
              className="w-full rounded-2xl bg-[#7f6b4f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#634f39]"
            >
              Continue to WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
