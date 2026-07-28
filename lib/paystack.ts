export interface PaystackConfig {
  key: string;
  email: string;
  amount: number; // in GHS sub-units (pesewas: amount * 100)
  currency: string; // 'GHS'
  ref: string; // Unique transaction reference
  metadata?: {
    custom_fields?: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
    orderId?: string;
    customerPhone?: string;
  };
  onSuccess: (reference: { reference: string; status: string; trans: string }) => void;
  onClose: () => void;
}

export const PAYSTACK_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_PAYSTACK_KEY || 'pk_test_placeholder_key';

export const loadPaystackScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if ((window as unknown as { PaystackPop?: unknown }).PaystackPop) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `EUS-${timestamp}${random}`;
};
