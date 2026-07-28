'use client';

import { useEffect, useState } from 'react';
import ProductDetailClient from '@/components/product-detail-client';
import { fetchProductById, fetchProductsByIds } from '@/lib/firestore';
import { Product } from '@/lib/types';

interface ProductDetailLoaderProps {
  productId: string;
}

export default function ProductDetailLoader({ productId }: ProductDetailLoaderProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProduct() {
      try {
        const fetchedProduct = await fetchProductById(productId);
        if (!mounted) return;

        if (!fetchedProduct) {
          setError('Product not found.');
          return;
        }

        setProduct(fetchedProduct);

        if (fetchedProduct.relatedProducts?.length) {
          const related = await fetchProductsByIds(fetchedProduct.relatedProducts);
          if (mounted) {
            setRelatedProducts(related);
          }
        }
      } catch (err) {
        console.error('Failed to load product:', err);
        if (mounted) {
          setError('Unable to load product data.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-primary font-semibold">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-6">
        <div className="max-w-xl text-center bg-white rounded-3xl shadow-lg p-10">
          <p className="text-xl font-bold text-primary mb-4">{error || 'Product not found.'}</p>
          <p className="text-on-surface-variant mb-8">
            Please head back to the shop and explore our current collection.
          </p>
          <a
            href="/shop"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-secondary text-white font-semibold hover:bg-secondary/90 transition"
          >
            Back to Shop
          </a>
        </div>
      </div>
    );
  }

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
