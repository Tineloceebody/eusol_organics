import Link from 'next/link';
import AddProduct from './AddProduct';

export default function AdminDashboardLayout() {
  return (
    <div className="min-h-screen bg-[#F4EEE0] text-[#3D372E]">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <aside className="w-full max-w-[280px] rounded-[32px] border border-[#D7C7A7] bg-[#F8F1E4] p-6 shadow-sm">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.28em] text-[#8B7A5F]">Admin area</p>
            <h2 className="mt-3 text-2xl font-semibold text-[#3C3A36]">Eusol Dashboard</h2>
            <p className="mt-2 text-sm leading-6 text-[#6B5F4D]">
              Create products, upload rich media, and manage your catalog from one clean panel.
            </p>
          </div>

          <nav className="space-y-3">
            <Link
              href="/admin/AddProduct"
              className="block rounded-3xl bg-[#C9B38F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#A18A68]"
            >
              Add Product
            </Link>
            <Link
              href="/admin/Dashboard"
              className="block rounded-3xl border border-[#D7C7A7] bg-white px-4 py-3 text-sm font-semibold text-[#3C3A36] transition hover:border-[#A18A68] hover:text-[#A18A68]"
            >
              Dashboard Home
            </Link>
          </nav>
        </aside>

        <main className="flex-1">
          <AddProduct />
        </main>
      </div>
    </div>
  );
}
