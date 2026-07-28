"use client";

import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CartDrawer from "@/components/cart-drawer";
import WhatsAppButton from "@/components/whatsapp-button";
import { ArrowRight, Leaf, Heart, Users, Award } from "lucide-react";

const values = [
  {
    icon: <Leaf className="w-8 h-8" />,
    title: "Purity First",
    description: "We never compromise on quality. Every product is sourced directly from trusted Ghanaian farmers who share our commitment to organic, chemical-free cultivation.",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Community Rooted",
    description: "Our partnerships with local farming communities ensure fair wages and sustainable practices that honor both people and the planet.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Heritage Preserved",
    description: "We document and preserve traditional knowledge, ensuring that ancestral wisdom about healing plants is passed to future generations.",
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Scientifically Verified",
    description: "While rooted in tradition, every product is validated for purity and potency through rigorous quality testing.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <WhatsAppButton />

      <main className="pt-24 md:pt-32 pb-20">
        {/* Hero */}
        <section className="max-w-screen-2xl mx-auto px-6 md:px-8 mb-20 md:mb-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-end">
            <div className="md:col-span-7 z-10">
              <span className="text-secondary font-sans uppercase tracking-widest text-xs font-bold mb-4 block">
                Our Heritage
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black italic text-primary leading-tight">
                Born in Accra, Crafted for the Global Soul.
              </h1>
              <p className="mt-6 md:mt-8 text-lg md:text-xl text-on-surface-variant max-w-xl font-light leading-relaxed">
                From the bustling markets of Madina to our modern preparation space, Eusol Organics is the culmination of three generations of botanical wisdom.
              </p>
            </div>
            <div className="md:col-span-5 relative">
              <div className="absolute inset-0 bg-surface-container-low translate-x-4 md:translate-x-8 -translate-y-4 md:-translate-y-8 -z-10 rounded-lg" />
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop"
                alt="EUSOL workshop"
                className="w-full aspect-[4/5] object-cover rounded-lg shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="bg-surface-container-low py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="relative order-2 md:order-1">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop"
                  alt="Artisan at work"
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div className="absolute -bottom-6 -right-6 bg-secondary p-6 rounded-lg text-white hidden md:block">
                  <p className="font-serif italic text-lg">&ldquo;The earth has music for those who listen.&rdquo;</p>
                </div>
              </div>
              <div className="space-y-6 md:space-y-8 order-1 md:order-2">
                <span className="text-secondary font-sans text-xs uppercase tracking-[0.2em] font-bold">
                  Our Story
                </span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-primary">
                  Three Generations of Botanical Wisdom
                </h2>
                <div className="space-y-4 text-on-surface-variant leading-relaxed">
                  <p>
                    EUSOL ORGANICS began as a small family practice in Madina, where our grandmother would prepare herbal remedies for neighbors and family members. What started as a kitchen-table operation has evolved into Ghana&apos;s premier destination for organic botanicals.
                  </p>
                  <p>
                    We don&apos;t just make products; we curate experiences that connect you back to the earth. Each seed, powder, and herbal blend carries the intention of the hands that harvested it and the soil that nourished it.
                  </p>
                  <p>
                    Our name — EUSOL — combines &ldquo;Eu&rdquo; (wellness) and &ldquo;Sol&rdquo; (sun), representing our belief that true health comes from natural, sun-nourished sources.
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 border-b border-primary pb-1 font-sans text-sm uppercase tracking-widest hover:text-secondary hover:border-secondary transition-all pt-4"
                >
                  Explore Our Collection
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-secondary font-sans uppercase tracking-widest text-xs font-bold mb-3 block">
              What We Stand For
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-primary">
              Our Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="bg-surface-container-low p-8 md:p-10 rounded-lg space-y-4"
              >
                <div className="text-secondary">{value.icon}</div>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-primary">
                  {value.title}
                </h3>
                <p className="font-sans text-on-surface-variant leading-relaxed text-sm md:text-base">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Location / Visit Us */}
        <section className="bg-primary text-white py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div>
                <span className="text-on-primary-container/70 font-sans uppercase tracking-widest text-xs font-bold mb-4 block">
                  Visit Us
                </span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
                  Our Sanctuary in Madina
                </h2>
                <p className="text-on-primary-container/80 leading-relaxed mb-8">
                  Visit our flagship location at Madina, near Absa Bank. Experience the aroma of fresh botanicals, consult with our herbalists, and discover the perfect additions to your wellness ritual.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">📍</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Address</h4>
                      <p className="text-on-primary-container/70 text-sm">
                        Madina, near Absa Bank
                        <br />
                        Accra, Ghana
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">📞</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Contact</h4>
                      <p className="text-on-primary-container/70 text-sm">
                        0540996909 / 0245225911
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">🕐</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Hours</h4>
                      <p className="text-on-primary-container/70 text-sm">
                        Mon – Sat: 9:00 AM – 8:00 PM
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="aspect-square rounded-lg overflow-hidden bg-white/5">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=800&fit=crop"
                  alt="Madina location"
                  className="w-full h-full object-cover opacity-70"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
