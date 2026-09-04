import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/shop/ProductGrid'

export default async function ShopPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, description, price, slug, image_url')
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-4xl mx-auto px-6 py-20 bg-[var(--color-cream)] text-[var(--color-ink)] min-h-screen">
      <h1 className="text-4xl font-light mb-16 tracking-wide text-center">The Collection</h1>
      <ProductGrid products={products || []} />
    </main>
  )
}