import Link from "next/link";
import { MapPin, Phone, Globe, Camera, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-surface-bright">
      <div className="max-w-7xl mx-auto px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl italic text-surface-bright">
              EUSOL ORGANICS
            </h3>
            <p className="text-surface-bright/80 text-sm leading-relaxed font-light">
              Honoring the soil, the soul, and the sacred ritual of self-care. Bridging ancient Ghanaian herbal wisdom with modern wellness.
            </p>
          </div>

          {/* Discovery Column */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-widest text-surface-bright/60 mb-6">
              Discovery
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-surface-bright/70 hover:text-secondary-container text-sm transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-surface-bright/70 hover:text-secondary-container text-sm transition-colors">
                  Organic Ethos
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-surface-bright/70 hover:text-secondary-container text-sm transition-colors">
                  Shop All
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-widest text-surface-bright/60 mb-6">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-secondary-container text-sm transition-colors hover:text-secondary-container/90">
                  Contact Us
                </Link>
              </li>
              <li>
                <span className="text-surface-bright/70 text-sm cursor-default">
                  Shipping & Returns
                </span>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-widest text-surface-bright/60 mb-6">
              Connect
            </h4>
            <div className="flex space-x-4">
              <a href="#" className="text-surface-bright/70 hover:text-secondary-container transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-surface-bright/70 hover:text-secondary-container transition-colors">
                <Camera className="w-5 h-5" />
              </a>
              <a href="mailto:info@eusolorganics.com" className="text-surface-bright/70 hover:text-secondary-container transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <div className="pt-4 space-y-2">
              <div className="flex items-center space-x-2 text-surface-bright/60 text-xs">
                <MapPin className="w-4 h-4" />
                <span>Madina, near Absa Bank, Ghana</span>
              </div>
              <div className="flex items-center space-x-2 text-surface-bright/60 text-xs">
                <Phone className="w-4 h-4" />
                <span>0540996909 / 0245225911</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-surface-bright/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-surface-bright/50 text-xs tracking-widest">
            © 2024 EUSOL ORGANICS. Madina, near Absa Bank. Crafted for the Earthbound Curator.
          </p>
          <p className="text-surface-bright/50 text-xs tracking-widest">
            Handcrafted in Ghana
          </p>
        </div>
      </div>
    </footer>
  );
}
