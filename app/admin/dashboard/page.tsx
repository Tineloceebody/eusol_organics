'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/lib/admin-context';
import { useDropzone } from 'react-dropzone';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ProductMedia, Product } from '@/lib/types';
import {
  Upload,
  LogOut,
  Trash2,
  Check,
  CheckCircle,
  Plus,
  Edit3,
  Image as ImageIcon,
  Save,
  Tag,
} from 'lucide-react';
import {
  getProducts,
  updateProduct,
  createProduct,
  deleteProduct,
  deleteProductMedia,
} from '@/lib/db';

export default function AdminDashboardPage() {
  const { user, isAuthenticated, logout, loading } = useAdmin();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form State for Selected / New Item
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemCategory, setItemCategory] = useState<'Seeds' | 'Powders' | 'Herbal Products' | 'Accessories'>('Seeds');
  const [itemPrice, setItemPrice] = useState<number | string>(85);
  const [itemQuantity, setItemQuantity] = useState<number | string>(10);
  const [itemImage, setItemImage] = useState('');

  // Status & Media Upload State
  const [savingItem, setSavingItem] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const mediaType = 'image';
  const [altText, setAltText] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, router]);

  // Populate form with selected product data
  const populateForm = useCallback((product: Product) => {
    setIsCreatingNew(false);
    setItemName(product.name || '');
    setItemDescription(product.description || '');
    setItemCategory(product.category || 'Seeds');
    setItemPrice(product.price || 0);
    setItemQuantity(product.stockQuantity ?? (product.inStock === false ? 0 : 10));
    setItemImage(product.image || '');
  }, []);

  // Fetch products on mount
  const refreshProducts = useCallback(async (selectId?: string) => {
    try {
      const productList = await getProducts();
      setProducts(productList);
      if (productList.length > 0) {
        const targetId = selectId || selectedProductId || productList[0].id;
        const found = productList.find((p) => p.id === targetId) || productList[0];
        setSelectedProductId(found.id);
        populateForm(found);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }, [selectedProductId, populateForm]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshProducts();
    }
  }, [isAuthenticated, refreshProducts]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    populateForm(product);
  };

  const handleStartCreateNew = () => {
    setIsCreatingNew(true);
    setSelectedProductId('');
    setItemName('');
    setItemDescription('');
    setItemCategory('Seeds');
    setItemPrice(85);
    setItemQuantity(15);
    setItemImage('https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800&h=1000&fit=crop');
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingItem(true);
    setSaveSuccess(null);

    const numericPrice = parseFloat(String(itemPrice)) || 0;
    const numericQty = parseInt(String(itemQuantity), 10) || 0;

    try {
      if (isCreatingNew) {
        // Create new item
        const newProd = await createProduct({
          name: itemName || 'New Organic Product',
          description: itemDescription,
          healthBenefits: ['Natural & Organic', 'Authentic Sourcing'],
          category: itemCategory,
          price: numericPrice,
          currency: 'GHS',
          image: itemImage || 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800&h=1000&fit=crop',
          inStock: numericQty > 0,
          stockQuantity: numericQty,
        });
        setIsCreatingNew(false);
        setProducts((prev) => [newProd, ...prev.filter((p) => p.id !== newProd.id)]);
        setSelectedProductId(newProd.id);
        populateForm(newProd);
        setSaveSuccess('New item created successfully!');
      } else {
        // Update existing item
        if (!selectedProductId) return;
        await updateProduct(selectedProductId, {
          name: itemName,
          description: itemDescription,
          category: itemCategory,
          price: numericPrice,
          stockQuantity: numericQty,
          inStock: numericQty > 0,
          image: itemImage,
        });
        await refreshProducts(selectedProductId);
        setSaveSuccess('Item details updated successfully!');
      }
      setTimeout(() => setSaveSuccess(null), 3500);
    } catch (err) {
      console.error('Failed to save product:', err);
    } finally {
      setSavingItem(false);
    }
  };

  const handleDeleteCurrentProduct = async () => {
    if (!selectedProductId) return;
    const activeProd = products.find((p) => p.id === selectedProductId);
    if (!confirm(`Are you sure you want to delete "${activeProd?.name}"?`)) return;

    await deleteProduct(selectedProductId);
    const updated = products.filter((p) => p.id !== selectedProductId);
    setProducts(updated);
    if (updated.length > 0) {
      handleSelectProduct(updated[0]);
    } else {
      handleStartCreateNew();
    }
  };

  // Delete a media image from product gallery or reset primary image
  const handleDeleteImage = async (mediaId?: string, isMainImage?: boolean) => {
    if (!selectedProductId) return;

    if (isMainImage) {
      if (confirm('Delete/clear primary image URL for this item?')) {
        setItemImage('');
        await updateProduct(selectedProductId, { image: '' });
        await refreshProducts(selectedProductId);
      }
      return;
    }

    if (mediaId) {
      if (confirm('Delete this gallery image from the item?')) {
        await deleteProductMedia(selectedProductId, mediaId);
        const currentProd = products.find((p) => p.id === selectedProductId);
        if (currentProd && currentProd.media) {
          const updatedMedia = currentProd.media.filter((m) => m.id !== mediaId);
          await updateProduct(selectedProductId, { media: updatedMedia });
        }
        await refreshProducts(selectedProductId);
      }
    }
  };

  // Add Image via Direct URL
  const handleAddImageUrl = async () => {
    if (!imageUrlInput.trim() || !selectedProductId) return;
    const currentProd = products.find((p) => p.id === selectedProductId);
    if (!currentProd) return;

    const newMedia: ProductMedia = {
      id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: 'image',
      url: imageUrlInput.trim(),
      altText: altText || currentProd.name,
      isPrimary: false,
      uploadedAt: new Date(),
      fileName: imageUrlInput.trim(),
    };

    const existingMedia = currentProd.media || [];
    const updatedMedia = [...existingMedia, newMedia];

    await updateProduct(selectedProductId, { media: updatedMedia });
    setImageUrlInput('');
    setAltText('');
    await refreshProducts(selectedProductId);
  };

  // Dropzone File Upload Handler
  const onDrop = async (acceptedFiles: File[]) => {
    if (!selectedProductId) {
      setUploadError('Please select or create a product first');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const currentProd = products.find((p) => p.id === selectedProductId);
      const existingMedia = currentProd?.media || [];
      const newMediaItems: ProductMedia[] = [];

      for (const file of acceptedFiles) {
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          throw new Error('Please upload image or video files');
        }

        let downloadURL = '';
        try {
          const fileName = `${mediaType}s/${selectedProductId}/${Date.now()}-${file.name}`;
          const fileRef = ref(storage, fileName);
          await uploadBytes(fileRef, file);
          downloadURL = await getDownloadURL(fileRef);
        } catch {
          // Fallback object URL if Firebase storage is not configured locally
          downloadURL = URL.createObjectURL(file);
        }

        const media: ProductMedia = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          type: mediaType,
          url: downloadURL,
          altText: altText || file.name,
          isPrimary: false,
          uploadedAt: new Date(),
          fileName: file.name,
        };

        newMediaItems.push(media);
      }

      const updatedMedia = [...existingMedia, ...newMediaItems];
      await updateProduct(selectedProductId, { media: updatedMedia });

      setUploadSuccess(true);
      setAltText('');
      await refreshProducts(selectedProductId);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error: unknown) {
      setUploadError((error as Error).message || 'Failed to upload media');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: mediaType === 'image' ? { 'image/*': [] } : { 'video/*': [] },
    disabled: uploading || !selectedProductId,
  });

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f2e6]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#7f6b4f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1f1b13] font-semibold">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const selectedProductObj = products.find((p) => p.id === selectedProductId);

  return (
    <div className="min-h-screen bg-[#f8f2e6] text-[#1f1b13]">
      {/* Header */}
      <header className="bg-white border-b border-[#e7dcc4] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#7f6b4f]">
              EUSOL Admin Inventory
            </h1>
            <p className="text-xs text-[#5a5041]">Logged in as: {user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-[#7f6b4f] hover:bg-[#685740] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* LEFT COLUMN: Sidebar Inventory List */}
          <div className="lg:col-span-1 bg-white border border-[#e7dcc4] rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-bold text-[#1f1b13]">All Products</h2>
              <button
                type="button"
                onClick={handleStartCreateNew}
                className="bg-[#7f6b4f] text-white hover:bg-[#685740] px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition"
              >
                <Plus size={14} /> Add Item
              </button>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {products.length === 0 ? (
                <p className="text-xs text-[#5a5041] italic py-4 text-center">No products found.</p>
              ) : (
                products.map((product) => {
                  const isOut =
                    product.inStock === false ||
                    (typeof product.stockQuantity === 'number' && product.stockQuantity <= 0);
                  const isSelected = !isCreatingNew && selectedProductId === product.id;

                  return (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-[#efe8d7] border-[#7f6b4f] shadow-sm'
                          : 'bg-white border-[#e7dcc4] hover:border-[#7f6b4f]/50'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#efe8d7] overflow-hidden flex-shrink-0 relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {isOut && (
                          <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center text-[8px] font-bold uppercase text-white">
                            Out
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-[#1f1b13] truncate">{product.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-semibold text-[#7f6b4f]">
                            GHS {product.price}
                          </span>
                          <span className="text-[10px] text-[#5a5041]">•</span>
                          <span
                            className={`text-[10px] font-bold ${
                              isOut ? 'text-red-700' : 'text-emerald-700'
                            }`}
                          >
                            {isOut ? 'Out of Stock' : `${product.stockQuantity ?? 10} qty`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Edit Item Form & Image Management */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section 1: Item Details Editor / Creator */}
            <div className="bg-white border border-[#e7dcc4] rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e7dcc4] pb-4 mb-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#1f1b13] flex items-center gap-2">
                    <Edit3 size={20} className="text-[#7f6b4f]" />
                    {isCreatingNew ? 'Create New Organic Item' : `Edit "${itemName || 'Item'}"`}
                  </h2>
                  <p className="text-xs text-[#5a5041] mt-1">
                    Manage item name, description, price, stock quantity, and main image.
                  </p>
                </div>
                {!isCreatingNew && selectedProductId && (
                  <button
                    type="button"
                    onClick={handleDeleteCurrentProduct}
                    className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-1.5"
                  >
                    <Trash2 size={14} /> Delete Item
                  </button>
                )}
              </div>

              {saveSuccess && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs font-bold text-emerald-800">
                  <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
                  <span>{saveSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSaveProduct} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Item Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5a5041] mb-2">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Artisan Moringa Seeds"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#e7dcc4] bg-white text-sm text-[#1f1b13] focus:outline-none focus:ring-2 focus:ring-[#7f6b4f]"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5a5041] mb-2 flex items-center gap-1">
                      <Tag size={13} className="text-[#7f6b4f]" /> Category *
                    </label>
                    <select
                      value={itemCategory}
                      onChange={(e) =>
                        setItemCategory(
                          e.target.value as 'Seeds' | 'Powders' | 'Herbal Products' | 'Accessories'
                        )
                      }
                      className="w-full px-4 py-3 rounded-xl border border-[#e7dcc4] bg-white text-sm text-[#1f1b13] focus:outline-none focus:ring-2 focus:ring-[#7f6b4f]"
                    >
                      <option value="Seeds">Seeds</option>
                      <option value="Powders">Powders</option>
                      <option value="Herbal Products">Herbal Products</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5a5041] mb-2">
                      Price (GHS) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      required
                      placeholder="85"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#e7dcc4] bg-white text-sm font-bold text-[#1f1b13] focus:outline-none focus:ring-2 focus:ring-[#7f6b4f]"
                    />
                  </div>

                  {/* Stock Quantity */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5a5041] mb-2">
                      Stock Quantity (Units) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="10"
                      value={itemQuantity}
                      onChange={(e) => setItemQuantity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#e7dcc4] bg-white text-sm font-bold text-[#1f1b13] focus:outline-none focus:ring-2 focus:ring-[#7f6b4f]"
                    />
                    <p className="text-[10px] text-[#7f6b4f] mt-1 font-semibold">
                      {parseInt(String(itemQuantity), 10) <= 0
                        ? '⚠️ Item will be automatically marked OUT OF STOCK.'
                        : `✓ Item is IN STOCK (${itemQuantity} units available).`}
                    </p>
                  </div>
                </div>

                {/* Primary Image URL */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5a5041] mb-2 flex items-center gap-1">
                    <ImageIcon size={14} className="text-[#7f6b4f]" /> Main Product Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={itemImage}
                    onChange={(e) => setItemImage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#e7dcc4] bg-white text-sm text-[#1f1b13] focus:outline-none focus:ring-2 focus:ring-[#7f6b4f]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5a5041] mb-2">
                    Item Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide detailed information about origin, benefits, and usage instructions..."
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#e7dcc4] bg-white text-sm text-[#1f1b13] focus:outline-none focus:ring-2 focus:ring-[#7f6b4f]"
                  />
                </div>

                <div className="pt-2 flex gap-4">
                  <button
                    type="submit"
                    disabled={savingItem}
                    className="w-full bg-[#7f6b4f] hover:bg-[#685740] disabled:opacity-50 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Save size={16} />
                    {savingItem
                      ? 'Saving Item...'
                      : isCreatingNew
                      ? 'Create Product'
                      : 'Save Item Details'}
                  </button>
                </div>
              </form>
            </div>

            {/* Section 2: Manage & Delete Product Images Gallery */}
            {!isCreatingNew && selectedProductObj && (
              <div className="bg-white border border-[#e7dcc4] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#1f1b13] flex items-center gap-2">
                    <ImageIcon size={20} className="text-[#7f6b4f]" /> Item Images Gallery & Uploads
                  </h2>
                  <p className="text-xs text-[#5a5041] mt-1">
                    View all images for <strong>{selectedProductObj.name}</strong>, delete unwanted photos, or upload new high-res images.
                  </p>
                </div>

                {/* Gallery Items Grid */}
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#5a5041]">
                    Current Images
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {/* Primary Image Card */}
                    {selectedProductObj.image && (
                      <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-[#7f6b4f] group bg-[#efe8d7]">
                        <img
                          src={selectedProductObj.image}
                          alt={selectedProductObj.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#7f6b4f] text-white text-[9px] uppercase font-bold tracking-wider rounded-md shadow">
                          Main Image
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(undefined, true)}
                          className="absolute bottom-2 right-2 p-2 bg-red-700 hover:bg-red-800 text-white rounded-xl shadow-md transition flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
                          title="Delete Main Image"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}

                    {/* Media Gallery Images */}
                    {selectedProductObj.media && selectedProductObj.media.length > 0 ? (
                      selectedProductObj.media.map((med) => (
                        <div
                          key={med.id}
                          className="relative aspect-square rounded-2xl overflow-hidden border border-[#e7dcc4] group bg-[#efe8d7]"
                        >
                          {med.type === 'video' ? (
                            <video src={med.url} className="w-full h-full object-cover" />
                          ) : (
                            <img src={med.url} alt={med.altText} className="w-full h-full object-cover" />
                          )}
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#5a5041]/80 text-white text-[9px] uppercase font-bold tracking-wider rounded-md">
                            {med.type}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(med.id)}
                            className="absolute bottom-2 right-2 p-2 bg-red-700 hover:bg-red-800 text-white rounded-xl shadow-md transition flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
                            title="Delete Image"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      ))
                    ) : (
                      !selectedProductObj.image && (
                        <p className="text-xs text-[#5a5041] italic col-span-full py-4 text-center">
                          No gallery images uploaded yet for this item.
                        </p>
                      )
                    )}
                  </div>
                </div>

                {/* Upload Section: Dropzone & Direct URL */}
                <div className="pt-4 border-t border-[#e7dcc4] space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#5a5041]">
                    Add New Image to Gallery
                  </p>

                  {/* Option A: Image URL */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste image URL (e.g. https://...)"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-[#e7dcc4] bg-white text-xs text-[#1f1b13] focus:outline-none focus:ring-2 focus:ring-[#7f6b4f]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      disabled={!imageUrlInput.trim()}
                      className="px-4 py-2.5 bg-[#7f6b4f] hover:bg-[#685740] disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
                    >
                      Add Image URL
                    </button>
                  </div>

                  {/* Option B: Dropzone File Upload */}
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer ${
                      isDragActive
                        ? 'border-[#7f6b4f] bg-[#efe8d7]'
                        : 'border-[#e7dcc4] hover:border-[#7f6b4f]'
                    } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto mb-3 text-[#7f6b4f]" size={36} />
                    <p className="text-xs font-bold uppercase tracking-wider text-[#1f1b13]">
                      Drag and drop image files here, or click to upload
                    </p>
                    <p className="text-[11px] text-[#5a5041] mt-1">
                      Supports JPG, PNG, WEBP and MP4 media
                    </p>
                  </div>

                  {uploadError && (
                    <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl">
                      {uploadError}
                    </div>
                  )}

                  {uploadSuccess && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                      <Check size={16} /> Image uploaded successfully to item gallery!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
