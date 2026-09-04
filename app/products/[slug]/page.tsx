import ProductCanvas from '@/components/three/ProductCanvas'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import AddToCartButton from '@/components/ui/AddToCartButton'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!product) notFound()

  return (
    <main className="bg-[var(--color-cream)] text-[var(--color-ink)] min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center bg-[var(--color-ink)]/5 min-h-[50vh] md:min-h-screen">
        <ProductCanvas modelUrl={product.model_url || '/models/product1.glb'} />
      </div>

      <div className="flex flex-col justify-center px-10 py-16 gap-6 max-w-md mx-auto">
        <h1 className="text-4xl font-light">{product.name}</h1>
        <p className="text-xl text-[var(--color-gold)]">{product.price} EGP</p>
        <p className="text-[var(--color-ink)]/70 leading-relaxed">{product.description}</p>
        <AddToCartButton
          productId={product.id}
          name={product.name}
          price={product.price}
        />
      </div>
    </main>
  )
}