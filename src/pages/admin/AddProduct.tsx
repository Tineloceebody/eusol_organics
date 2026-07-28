'use client';

import { useMemo, useState } from 'react';
import MediaUploader from '../../components/admin/MediaUploader';
import { createProduct } from '@/lib/db';
import { Product, ProductMedia } from '@/lib/types';

const categoryOptions: Array<{ label: string; value: Product['category'] }> = [
  { label: 'Seeds', value: 'Seeds' },
  { label: 'Powders', value: 'Powders' },
  { label: 'Accessories', value: 'Accessories' },
];

export default function AddProductPage() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Product['category']>('Seeds');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [inStock, setInStock] = useState(true);
  const [media, setMedia] = useState<ProductMedia[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mediaCount = useMemo(() => media.length, [media]);

  const handleUploadSuccess = (nextMedia: ProductMedia) => {
    setMedia((current) => [...current, nextMedia]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const priceValue = Number(price);

    const validationErrors: string[] = [];

    if (!trimmedName) {
      validationErrors.push('Name is required.');
    }

    if (!price || Number.isNaN(priceValue) || priceValue <= 0) {
      validationErrors.push('Price must be a number greater than 0.');
    }

    if (mediaCount === 0) {
      validationErrors.push('Please upload at least one image or video.');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setSuccessMessage('');
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      const newProduct: Omit<Product, 'id' | 'createdAt'> = {
        name: trimmedName,
        description: trimmedDescription,
        category,
        price: priceValue,
        currency: 'USD',
        image: media[0]?.url ?? '',
        media,
        inStock,
        healthBenefits: [],
      };

      await createProduct(newProduct);

      setName('');
      setCategory('Seeds');
      setPrice('');
      setDescription('');
      setInStock(true);
      setMedia([]);
      setSuccessMessage('Product created successfully.');
    } catch (createError: unknown) {
      setErrors([(createError as Error)?.message ?? 'Unable to create product.']);
      setSuccessMessage('');
      console.error('Create product failed:', createError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-[#D7C7A7] bg-[#FAF3E8] p-8 shadow-sm">
        <div className="mb-8 flex flex-col gap-3">
          <p className="text-sm uppercase tracking-[0.24em] text-[#8B7A5F]">Admin product creation</p>
          <h1 className="text-3xl font-semibold text-[#3D372E]">Add a new organic product</h1>
          <p className="max-w-2xl text-sm leading-6 text-[#6B5F4D]">
            Upload organic seed and powder media, capture pricing and category, and save it to Firestore.
          </p>
        </div>

        {errors.length > 0 && (
          <div className="mb-6 rounded-3xl border border-[#E3B76B] bg-[#FBF1D8] p-5 text-sm text-[#7B4E19]">
            <ul className="list-disc space-y-1 pl-5">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-3xl border border-[#B8C3A3] bg-[#E8F1E3] p-5 text-sm text-[#43543A]">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-6 xl:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-[#3C3A36]">
              Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Organic chia seeds"
                className="w-full rounded-3xl border border-[#D7C7A7] bg-white px-4 py-3 text-sm text-[#3C3A36] shadow-sm outline-none transition focus:border-[#A18A68] focus:ring-2 focus:ring-[#D7C7A7]"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-[#3C3A36]">
              Category
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as Product['category'])}
                className="w-full rounded-3xl border border-[#D7C7A7] bg-white px-4 py-3 text-sm text-[#3C3A36] shadow-sm outline-none transition focus:border-[#A18A68] focus:ring-2 focus:ring-[#D7C7A7]"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-[#3C3A36]">
              Price
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="24.99"
                className="w-full rounded-3xl border border-[#D7C7A7] bg-white px-4 py-3 text-sm text-[#3C3A36] shadow-sm outline-none transition focus:border-[#A18A68] focus:ring-2 focus:ring-[#D7C7A7]"
              />
            </label>

            <label className="flex items-center gap-3 rounded-3xl border border-[#D7C7A7] bg-white px-4 py-3 shadow-sm">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(event) => setInStock(event.target.checked)}
                className="h-5 w-5 rounded border-[#D7C7A7] text-[#A18A68] focus:ring-[#A18A68]"
              />
              <span className="text-sm font-medium text-[#3C3A36]">In stock</span>
            </label>
          </div>

          <label className="space-y-2 text-sm font-medium text-[#3C3A36]">
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Write a short product description..."
              rows={5}
              className="w-full rounded-3xl border border-[#D7C7A7] bg-white px-4 py-3 text-sm text-[#3C3A36] shadow-sm outline-none transition focus:border-[#A18A68] focus:ring-2 focus:ring-[#D7C7A7]"
            />
          </label>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#3C3A36]">Product media</p>
                <p className="text-xs text-[#7B6B4B]">Upload at least one image or video for the product listing.</p>
              </div>
              <p className="text-sm text-[#5B4D3B]">{mediaCount} uploaded</p>
            </div>
            <MediaUploader onUploadSuccess={handleUploadSuccess} />
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-3xl bg-[#8B7A5F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#7A6B52] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Saving…' : 'Save product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
