import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/app/providers";

export const metadata: Metadata = {
  title: "EUSOL ORGANICS | Modern Alchemy for the Soul",
  description: "Premium organic seeds, powders, and herbal products sourced from the heart of Ghana. Honoring the soil, the soul, and the sacred ritual of self-care.",
  keywords: "organic, Ghana, seeds, powders, herbal, moringa, hibiscus, turmeric, wellness, natural",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#f8f2e6]">
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
