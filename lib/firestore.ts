import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { Product } from './types';

const mapProductSnapshot = (docSnapshot: { id: string; data: () => Record<string, unknown> }): Product => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    ...data,
  } as Product;
};

export async function fetchProducts(): Promise<Product[]> {
  const productsCollection = collection(db, 'products');
  const productsQuery = query(productsCollection, orderBy('name'));
  const snapshot = await getDocs(productsQuery);
  return snapshot.docs.map(mapProductSnapshot);
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const productRef = doc(db, 'products', id);
  const snapshot = await getDoc(productRef);
  if (!snapshot.exists()) {
    return null;
  }
  return mapProductSnapshot(snapshot);
}

export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) {
    return [];
  }

  const productsCollection = collection(db, 'products');
  const productsQuery = query(productsCollection, where('__name__', 'in', ids));
  const snapshot = await getDocs(productsQuery);
  return snapshot.docs.map(mapProductSnapshot);
}
