'use client'
import { useState, useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { useCart } from '@/lib/cart-context'

type Product = {
  id: string
  name: string
  description: string
  price: number
  slug: string
  image_url?: string
}

export default function ProductGrid({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<Product | null>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const panelRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const originRect = useRef<DOMRect | null>(null)
  const { addItem, openCart } = useCart()

  function openProduct(product: Product) {
    const card = cardRefs.current[product.id]
    if (!card) return
    originRect.current = card.getBoundingClientRect()
    setSelected(product)
  }

  useLayoutEffect(() => {
    if (!selected || !panelRef.current || !originRect.current) return

    const backdrop = backdropRef.current
    const panel = panelRef.current
    const origin = originRect.current
    const final = panel.getBoundingClientRect()

    const deltaX = origin.left + origin.width / 2 - (final.left + final.width / 2)
    const deltaY = origin.top + origin.height / 2 - (final.top + final.height / 2)
    const scale = Math.min(origin.width / final.width, origin.height / final.height)

    gsap.set(backdrop, { opacity: 0 })
    gsap.to(backdrop, { opacity: 1, duration: 0.25 })

    gsap.fromTo(
      panel,
      { x: deltaX, y: deltaY, scale, opacity: 0.6 },
      {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.from('.product-modal-info > *', {
            opacity: 0,
            y: 12,
            stagger: 0.06,
            duration: 0.3,
          })
        },
      }
    )
  }, [selected])

  function closeProduct() {
    const panel = panelRef.current
    const backdrop = backdropRef.current
    const origin = originRect.current
    if (!panel || !backdrop || !origin) return

    const final = panel.getBoundingClientRect()
    const deltaX = origin.left + origin.width / 2 - (final.left + final.width / 2)
    const deltaY = origin.top + origin.height / 2 - (final.top + final.height / 2)
    const scale = Math.min(origin.width / final.width, origin.height / final.height)

    gsap.to(backdrop, { opacity: 0, duration: 0.3 })
    gsap.to(panel, {
      x: deltaX,
      y: deltaY,
      scale,
      opacity: 0.6,
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: () => setSelected(null),
    })
  }

  function handleBuyNow() {
    if (!selected) return
    addItem({ productId: selected.id, name: selected.name, price: selected.price, quantity: 1 })
    setSelected(null)
    openCart()
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
        {products.map((product) => (
          <div
            key={product.id}
            ref={(el) => { cardRefs.current[product.id] = el }}
            onClick={() => openProduct(product)}
            className="group cursor-pointer"
          >
            <div className="aspect-[3/4] bg-[var(--color-ink)]/5 border border-[var(--color-ink)]/10 overflow-hidden mb-4 rounded-tl-[70px] rounded-br-[70px] transition-all duration-700 group-hover:border-[var(--color-gold)]">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 bg-[var(--color-ink)]/5" />
              )}
            </div>
            <h2 className="text-lg font-light transition-colors duration-300 group-hover:text-[var(--color-gold)]">
              {product.name}
            </h2>
            <p className="mt-1 text-[var(--color-gold)] opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              {product.price} EGP
            </p>
          </div>
        ))}
      </div>

      {selected && (
        <div
          ref={backdropRef}
          onClick={closeProduct}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            ref={panelRef}
            className="w-full max-w-md max-h-[85vh] flex flex-col bg-[var(--color-cream)] rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="relative h-64 shrink-0">
              <button
                onClick={closeProduct}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50"
              >
                ×
              </button>
              {selected.image_url ? (
                <img src={selected.image_url} alt={selected.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[var(--color-ink)]/5" />
              )}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4 pointer-events-none">
                <h1 className="text-white text-xl font-light">{selected.name}</h1>
              </div>
            </div>

            <div className="product-modal-info flex-1 overflow-y-auto p-6 flex flex-col items-center text-center gap-2">
              <p className="text-[var(--color-ink)]/70 leading-relaxed text-sm">{selected.description}</p>
              <p className="text-lg text-[var(--color-gold)]">{selected.price} EGP</p>
            </div>

            <div className="p-6 pt-0 shrink-0">
              <button
                onClick={handleBuyNow}
                className="w-full bg-[var(--color-ink)] text-[var(--color-cream)] px-8 py-3 rounded-full hover:bg-[var(--color-gold)] transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}