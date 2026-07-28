"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CartDrawer from "@/components/cart-drawer";
import WhatsAppButton from "@/components/whatsapp-button";
import { ShoppingBasket, Plus, Minus, Trash2, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

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
    <>
      <Navbar />
      <CartDrawer />
      <WhatsAppButton />

      <main className="pt-24 md:pt-32 pb-20 min-h-[60dvh]">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <h1 className="font-serif text-4xl md:text-5xl text-primary mb-8 md:mb-12">
            Your Ritual Basket
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-16 md:py-24">
              <ShoppingBasket className="w-16 h-16 md:w-20 md:h-20 text-primary/20 mx-auto mb-6" />
              <p className="font-serif text-xl md:text-2xl text-primary/60 mb-4">
                Your basket is empty
              </p>
              <p className="text-on-surface-variant max-w-md mx-auto mb-8 text-sm md:text-base">
                Discover our curated collection of organic botanicals and begin your wellness journey.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all"
              >
                Explore Shop
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Items */}
              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 md:gap-6 pb-6 border-b border-outline-variant/15"
                  >
                    {/* Image */}
                    <Link
                      href={`/product/${item.product.id}`}
                      className="w-24 h-28 md:w-28 md:h-32 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <Link href={`/product/${item.product.id}`}>
                          <h3 className="font-serif text-lg font-bold text-primary hover:text-secondary transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="font-serif text-lg font-bold text-secondary ml-4">
                          {item.product.currency} {item.product.price * item.quantity}
                        </p>
                      </div>
                      <p className="text-xs text-on-surface-variant mb-3">
                        {item.product.category} • {item.product.weight}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-8 h-8 rounded bg-surface-container-low flex items-center justify-center text-primary hover:bg-surface-container transition-colors"
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
                            className="w-8 h-8 rounded bg-surface-container-low flex items-center justify-center text-primary hover:bg-surface-container transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-primary/40 hover:text-error transition-colors flex items-center gap-2 text-xs uppercase tracking-wider"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-surface-container-low p-6 md:p-8 rounded-lg space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="font-serif text-2xl font-bold text-primary">
                    GHS {totalPrice}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant/60 mb-4">
                  Delivery to Greater Accra calculated at checkout. Supports Paystack & Payment on Delivery.
                </p>
                <Link
                  href="/checkout"
                  className="w-full block text-center bg-secondary text-white py-4 rounded-lg font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all active:scale-[0.98]"
                >
                  Proceed to Web Checkout (Paystack / COD)
                </Link>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-lg font-bold uppercase tracking-wider text-xs border border-secondary text-secondary hover:bg-secondary/10 transition-colors"
                >
                  Quick Order via WhatsApp
                </button>
                <div className="flex justify-between pt-2">
                  <button
                    onClick={clearCart}
                    className="text-xs text-primary/50 hover:text-error transition-colors uppercase tracking-wider"
                  >
                    Clear Basket
                  </button>
                  <Link
                    href="/shop"
                    className="text-xs text-secondary hover:text-primary transition-colors uppercase tracking-wider font-bold"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
