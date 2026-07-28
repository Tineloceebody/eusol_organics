import { Product } from './types';
import { getProducts, getProductById } from './db';

export async function fetchProducts(): Promise<Product[]> {
  try {
    return await getProducts();
  } catch {
    return [];
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    return await getProductById(id);
  } catch {
    return null;
  }
}

export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  try {
    const all = await getProducts();
    return all.filter((p) => ids.includes(p.id));
  } catch {
    return [];
  }
}
