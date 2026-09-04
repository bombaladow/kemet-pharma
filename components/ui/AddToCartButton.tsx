'use client'
import { useCart } from '@/lib/cart-context'

export default function AddToCartButton({
  productId,
  name,
  price,
}: {
  productId: string
  name: string
  price: number
}) {
  const { addItem } = useCart()

  return (
    <button
      onClick={() => addItem({ productId, name, price, quantity: 1 })}
      className="bg-[var(--color-ink)] text-[var(--color-cream)] px-6 py-3 mt-6 hover:bg-[var(--color-gold)] transition"
    >
      Add to Cart
    </button>
  )
}