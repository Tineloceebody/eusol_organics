import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/db';
import { products } from '@/lib/data';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ProductDetailClient from '@/components/product-detail-client';

export function generateStaticParams() {
  return products.map((p) => ({
    id: p.id,
  }));
}

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <ProductDetailClient product={product} />
      <Footer />
    </>
  );
}
