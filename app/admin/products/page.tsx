import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-[var(--color-ink)] text-[var(--color-cream)] px-6 py-3 rounded-full hover:bg-[var(--color-gold)] transition"
        >
          Add Product
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {products?.map((product) => (
          <Link
            key={product.id}
            href={`/admin/products/${product.id}`}
            className="flex justify-between items-center border border-[var(--color-ink)]/10 p-4 hover:border-[var(--color-gold)] transition"
          >
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-[var(--color-ink)]/60">Stock: {product.stock}</p>
            </div>
            <p className="text-[var(--color-gold)]">{product.price} EGP</p>
          </Link>
        ))}
      </div>
    </main>
  )
}