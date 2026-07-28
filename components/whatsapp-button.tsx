"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  message?: string;
  phone?: string;
}

export default function WhatsAppButton({ 
  message = "Hello EUSOL ORGANICS! I'd like to place an order.",
  phone = "233540996909" 
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-[100] bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
      aria-label="Order via WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      
      {/* Tooltip on hover */}
      <span className="absolute right-full mr-3 bg-primary text-on-primary text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
        Order via WhatsApp
      </span>
    </button>
  );
}
