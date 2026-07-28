"use client";

import { useState, FormEvent } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CartDrawer from "@/components/cart-drawer";
import WhatsAppButton from "@/components/whatsapp-button";
import { ArrowRight, MapPin } from "lucide-react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "Product Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({ name: "", email: "", subject: "Product Inquiry", message: "" });
  };

  return (
    <>
      <Navbar />
      <CartDrawer />
      <WhatsAppButton />

      <main className="pt-24 md:pt-32 pb-20">
        {/* Hero */}
        <section className="max-w-screen-2xl mx-auto px-6 md:px-8 mb-16 md:mb-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-end">
            <div className="md:col-span-7 z-10">
              <span className="text-secondary font-sans uppercase tracking-widest text-xs font-bold mb-4 block">
                Connection
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black italic text-primary leading-tight">
                Let&apos;s Connect
              </h1>
              <p className="mt-6 md:mt-8 text-lg md:text-xl text-on-surface-variant max-w-xl font-light leading-relaxed">
                Rooted in tradition and crafted for the modern curator, we invite you to bridge the distance between the earth and your daily rituals.
              </p>
            </div>
            <div className="md:col-span-5 relative">
              <div className="absolute inset-0 bg-surface-container-low translate-x-4 md:translate-x-8 -translate-y-4 md:-translate-y-8 -z-10 rounded-lg" />
              <img
                src="https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800&h=1000&fit=crop"
                alt="Organic texture"
                className="w-full aspect-[4/5] object-cover rounded-lg shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="max-w-screen-2xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Visit Our Studio */}
          <div className="space-y-10 md:space-y-12">
            <div className="bg-surface-container-low p-8 md:p-12 lg:p-16 rounded-lg">
              <h2 className="text-3xl md:text-4xl font-serif italic mb-6 md:mb-8 text-primary">
                Visit Our Studio
              </h2>
              <div className="space-y-6 md:space-y-8">
                <div>
                  <label className="text-secondary uppercase tracking-widest text-xs font-bold mb-2 block">
                    Location
                  </label>
                  <p className="text-xl md:text-2xl font-serif leading-snug text-primary">
                    Madina, near Absa Bank
                    <br />
                    Accra, Ghana
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 pt-6 md:pt-8 border-t border-outline-variant/20">
                  <div>
                    <label className="text-secondary uppercase tracking-widest text-xs font-bold mb-2 block">
                      Direct Dial
                    </label>
                    <a
                      href="tel:0540996909"
                      className="text-lg md:text-xl font-sans font-bold text-primary hover:text-secondary transition-colors"
                    >
                      0540996909
                    </a>
                  </div>
                  <div>
                    <label className="text-secondary uppercase tracking-widest text-xs font-bold mb-2 block">
                      Support Line
                    </label>
                    <a
                      href="tel:0245225911"
                      className="text-lg md:text-xl font-sans font-bold text-primary hover:text-secondary transition-colors"
                    >
                      0245225911
                    </a>
                  </div>
                </div>
                <div className="pt-6 md:pt-8">
                  <div className="w-full h-48 md:h-64 bg-surface-container-highest rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin className="w-10 h-10 text-secondary" />
                    </div>
                    <img
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=400&fit=crop"
                      alt="Map location"
                      className="w-full h-full object-cover opacity-30"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Send a Message Form */}
          <div className="py-6 md:py-10">
            <h2 className="text-3xl md:text-4xl font-serif italic mb-8 md:mb-10 text-primary">
              Send a Message
            </h2>
            {isSubmitted ? (
              <div className="bg-primary-fixed p-8 md:p-10 rounded-lg text-center">
                <p className="font-serif text-xl text-primary mb-3">Thank You</p>
                <p className="text-on-surface-variant">
                  Your message has been received. We will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 text-secondary font-bold text-sm uppercase tracking-widest border-b border-secondary pb-1"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
                <div className="space-y-2 group">
                  <label className="text-xs uppercase tracking-widest font-bold text-on-surface-variant group-focus-within:text-secondary transition-colors">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-3 text-base md:text-lg transition-all placeholder:text-surface-dim"
                    placeholder="Kofi Mensah"
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="text-xs uppercase tracking-widest font-bold text-on-surface-variant group-focus-within:text-secondary transition-colors">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-3 text-base md:text-lg transition-all placeholder:text-surface-dim"
                    placeholder="kofi@example.com"
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="text-xs uppercase tracking-widest font-bold text-on-surface-variant group-focus-within:text-secondary transition-colors">
                    Subject
                  </label>
                  <select
                    value={formState.subject}
                    onChange={(e) =>
                      setFormState({ ...formState, subject: e.target.value })
                    }
                    className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-3 text-base md:text-lg transition-all appearance-none cursor-pointer"
                  >
                    <option>Product Inquiry</option>
                    <option>Wholesale Opportunities</option>
                    <option>Partnerships</option>
                    <option>Press & Editorial</option>
                  </select>
                </div>
                <div className="space-y-2 group">
                  <label className="text-xs uppercase tracking-widest font-bold text-on-surface-variant group-focus-within:text-secondary transition-colors">
                    Message
                  </label>
                  <textarea
                    required
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                    rows={4}
                    className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-3 text-base md:text-lg transition-all placeholder:text-surface-dim resize-none"
                    placeholder="How can we assist your organic journey?"
                  />
                </div>
                <div className="pt-4 md:pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative inline-flex items-center justify-between w-full md:w-auto md:min-w-[240px] bg-primary text-white px-6 md:px-8 py-4 rounded-lg overflow-hidden transition-transform active:scale-95 shadow-lg disabled:opacity-70"
                  >
                    <span className="z-10 text-sm font-bold uppercase tracking-widest">
                      {isSubmitting ? "Sending..." : "Inquire Now"}
                    </span>
                    <ArrowRight className="w-5 h-5 z-10 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-container opacity-100 transition-opacity" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Decorative Quote Section */}
        <section className="mt-20 md:mt-32 w-full h-72 md:h-96 overflow-hidden relative">
          <div className="absolute inset-0 bg-primary/90 z-10 flex items-center justify-center">
            <div className="text-center px-6 md:px-8">
              <p className="text-white/60 uppercase tracking-widest font-bold mb-4 md:mb-6 text-xs">
                Our Ethos
              </p>
              <h3 className="text-white text-xl md:text-3xl lg:text-4xl font-serif italic max-w-4xl leading-snug">
                &ldquo;The earth has music for those who listen. We simply bottle the harmony.&rdquo;
              </h3>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1920&h=600&fit=crop"
            alt="Ghanaian landscape"
            className="w-full h-full object-cover"
          />
        </section>
      </main>

      <Footer />
    </>
  );
}
