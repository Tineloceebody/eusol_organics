import { CartItem } from '@/store/useCart';

export function generateWhatsAppOrder(items: CartItem[], total: number): string {
  const itemLines = items
    .map(
      (item) =>
        `- ${item.quantity}x ${item.product.name} (${item.product.currency} ${(item.product.price * item.quantity).toFixed(2)})`
    )
    .join('\n');

  return `Hello Eusol Organics, I would like to place an order:

${itemLines}

Total: GHS ${total.toFixed(2)}

Delivery Area in Accra (e.g., Adenta, East Legon): [Your area]`;
}
