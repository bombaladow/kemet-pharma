'use client'
import { useState, useEffect } from 'react'
import IntroScreen from '@/components/ui/IntroScreen'
import ProductGrid from '@/components/shop/ProductGrid'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type Product = {
  id: string
  name: string
  description: string
  price: number
  slug: string
  image_url?: string
}

export default function Home() {
  const [introDone, setIntroDone] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [heroUrl, setHeroUrl] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('products')
      .select('id, name, description, price, slug, image_url')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => setProducts(data || []))

    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'hero_image_url')
      .single()
      .then(({ data }) => setHeroUrl(data?.value || null))
  }, [])

  return (
    <>
      {!introDone && <IntroScreen onFinish={() => setIntroDone(true)} />}
      <main className="bg-[var(--color-cream)] text-[var(--color-ink)]">
        <section className="relative h-[85vh] w-full flex flex-col justify-end p-8 md:p-16 overflow-hidden rounded-b-[60px]">
          <div className="absolute inset-0 z-0">
            {heroUrl ? (
              <img src={heroUrl} alt="Hero" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[var(--color-nile)]/20" />
            )}
          </div>
          <div className="relative z-10 max-w-lg space-y-4 text-[var(--color-ink)]">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold)]">Pure Nile Beauty</p>
            <h1 className="text-4xl md:text-6xl font-light tracking-tight">Kemet Pharma</h1>
            <Link
              href="/shop"
              className="inline-block bg-[var(--color-ink)] text-[var(--color-cream)] text-[10px] tracking-[0.25em] uppercase px-6 py-3 font-semibold hover:bg-[var(--color-gold)] transition rounded-full"
            >
              Shop the Collection
            </Link>
          </div>
        </section>

        <section id="story" className="min-h-[50vh] flex items-center justify-center px-6 py-20">
          <p className="text-2xl md:text-3xl max-w-2xl text-center font-light leading-relaxed">
            Inspired by the Nile, crafted for skin that deserves the essentials — nothing more, nothing less.
          </p>
        </section>

        <section className="min-h-screen flex flex-col items-center justify-center gap-10 px-6 py-20">
          <h2 className="text-3xl font-light tracking-wide">Featured</h2>
          <div className="w-full max-w-4xl">
            <ProductGrid products={products} />
          </div>
        </section>
      </main>
    </>
  )
}