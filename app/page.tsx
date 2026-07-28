import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { getProducts } from "@/lib/db";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-[#f8f2e6] text-[#1f1b13]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-16 md:px-8">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start mb-20">
          <div className="space-y-8">
            <div className="max-w-2xl space-y-6">
              <p className="text-xs uppercase tracking-[0.35em] text-[#7f6b4f] font-semibold">
                Editorial Storefront
              </p>
              <h1 className="text-5xl font-serif font-semibold leading-tight tracking-tight text-[#1f1b13] sm:text-6xl">
                Organic seed and powder craftsmanship designed for the senses.
              </h1>
              <p className="max-w-xl text-base leading-8 text-[#5a5041]">
                Discover a refined collection of heritage ingredients, refined for modern rituals. Each product is presented with a studio-inspired aesthetic that puts texture and purity first.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[32px] border border-[#e7dcc4] bg-white/90 p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.35em] text-[#7f6b4f] font-semibold">
                  Textured purity
                </p>
                <p className="mt-3 text-sm leading-7 text-[#4f4639]">
                  Carefully curated blends that celebrate raw, tactile ingredients and subtle earth tones.
                </p>
              </div>
              <div className="rounded-[32px] border border-[#e7dcc4] bg-white/90 p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.35em] text-[#7f6b4f] font-semibold">
                  Calm minimalism
                </p>
                <p className="mt-3 text-sm leading-7 text-[#4f4639]">
                  A clean, airy presentation that lets each product shine without distraction.
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[36px] border border-[#e7dcc4] bg-white shadow-[0_24px_80px_rgba(20,20,20,0.08)]">
            <div className="relative aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1200&q=80"
                alt="Studio shot of organic powders"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </section>

        <section className="space-y-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#7f6b4f] font-semibold">
                The Collection
              </p>
              <h2 className="mt-3 text-3xl font-serif font-semibold text-[#1f1b13] sm:text-4xl">
                Crafted for ritual.
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full border border-[#7f6b4f] px-5 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#7f6b4f] transition hover:bg-[#efe8d7]"
            >
              Browse all products
            </Link>
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
