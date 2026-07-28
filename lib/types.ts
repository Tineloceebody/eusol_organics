/**
 * ProductMedia
 * Represents media files (images or videos) associated with a product
 */
export interface ProductMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  altText: string;
  isPrimary: boolean;
  uploadedAt: Date;
  fileName: string;
}

/**
 * Product
 * Main product interface with extended media support for admin panel
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  healthBenefits: string[];
  category: "Seeds" | "Powders" | "Herbal Products" | "Accessories";
  price: number;
  currency: string;
  image: string;
  inStock?: boolean;
  stockQuantity?: number;
  createdAt?: Date;
  gallery?: string[];
  media?: ProductMedia[];
  badge?: string;
  provenance?: string;
  ritual?: RitualStep[];
  benefits?: Benefit[];
  weight?: string;
  relatedProducts?: string[];
}

export interface RitualStep {
  step: number;
  title: string;
  description: string;
}

export interface Benefit {
  icon: string;
  title: string;
  description: string;
  variant?: "default" | "dark";
}

export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * Greater Accra Delivery Areas & Fees
 */
export type GreaterAccraArea =
  | "East Legon"
  | "Spintex / Batsonaa"
  | "Airport Residential / Dzorwulu"
  | "Osu / Cantonments / Labone"
  | "Tema (Community 1-25)"
  | "Madina / Adenta"
  | "Dansoman / Korle Bu"
  | "Achimota / Dome"
  | "Lapaz / Abeka"
  | "Accra Central / Ridge"
  | "Haatso / Atomic"
  | "Sakumono / Lashibi"
  | "Other Greater Accra Location";

export type PaymentMethod = "paystack" | "cod" | "whatsapp";
export type PaymentStatus = "pending" | "paid" | "failed";
export type OrderStatus = "placed" | "processing" | "out_for_delivery" | "delivered" | "cancelled";

export interface CustomerInfo {
  fullName: string;
  phone: string; // WhatsApp / MoMo phone number
  email: string;
  region: "Greater Accra"; // Enforced restriction
  area: GreaterAccraArea;
  address: string; // Street name, house/apartment number
  landmark?: string; // e.g. Near Shell filling station
  notes?: string; // Special delivery instructions
}

export interface OrderItem {
  id?: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  weight?: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. EUS-1092
  userId?: string; // Supabase user auth id if logged in
  customerInfo: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}
