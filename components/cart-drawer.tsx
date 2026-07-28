"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { X, Plus, Minus, ShoppingBasket, Trash2 } from "lucide-react";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  if (!isOpen) return null;

  const handleCheckout = () => {
    const message = items
      .map(
        (item) =>
          `- ${item.product.name} (${item.quantity}x) - ${item.product.currency}${item.product.price * item.quantity}`
      )
      .join("\n");
    const total = `Total: GHS${totalPrice}`;
    const encodedMessage = encodeURIComponent(
      `Hello EUSOL ORGANICS!\n\nI would like to place an order:\n\n${message}\n\n${total}\n\nPlease confirm availability.`
    );
    window.open(`https://wa.me/233540996909?text=${encodedMessage}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-primary/50 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-surface-container-lowest h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/15">
          <div className="flex items-center space-x-3">
            <ShoppingBasket className="w-5 h-5 text-secondary" />
            <h2 className="font-serif text-xl font-bold text-primary">Your Basket</h2>
          </div>
          <button
            onClick={closeCart}
            className="text-primary/60 hover:text-secondary transition-colors"
            aria-label="Close cart"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <ShoppingBasket className="w-16 h-16 text-primary/20" />
              <p className="font-serif text-lg text-primary/60">Your basket is empty</p>
              <p className="text-sm text-on-surface-variant max-w-xs">
                Discover our curated collection of organic botanicals and begin your wellness journey.
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-4 bg-secondary text-on-secondary px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all"
              >
                Explore Shop
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 pb-6 border-b border-outline-variant/10 last:border-0"
                >
                  {/* Image */}
                  <div className="w-20 h-24 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base font-bold text-primary truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {item.product.category}
                    </p>
                    <p className="text-sm font-bold text-secondary mt-2">
                      {item.product.currency} {item.product.price}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded bg-surface-container-low flex items-center justify-center text-primary hover:bg-surface-container transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-bold w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          disabled={
                            typeof item.product.stockQuantity === "number" &&
                            item.quantity >= item.product.stockQuantity
                          }
                          className="w-8 h-8 rounded bg-surface-container-low flex items-center justify-center text-primary hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-primary/40 hover:text-error transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {typeof item.product.stockQuantity === "number" &&
                      item.quantity >= item.product.stockQuantity && (
                        <p className="text-[10px] text-amber-700 font-semibold mt-1">
                          Max available stock reached
                        </p>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-outline-variant/15 bg-surface-container-lowest space-y-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-on-surface-variant">Subtotal</span>
              <span className="font-serif text-xl font-bold text-primary">
                GHS {totalPrice}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant/60 mb-2">
              Delivery to Greater Accra calculated at checkout.
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full block text-center bg-secondary text-white py-3.5 rounded-lg font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all active:scale-[0.98]"
            >
              Proceed to Checkout (Paystack / COD)
            </Link>
            <button
              onClick={handleCheckout}
              className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-secondary/40 text-secondary hover:bg-secondary/10 transition-colors"
            >
              Quick Order via WhatsApp
            </button>
            <button
              onClick={clearCart}
              className="w-full text-[11px] text-primary/50 hover:text-error transition-colors uppercase tracking-wider pt-1"
            >
              Clear Basket
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
