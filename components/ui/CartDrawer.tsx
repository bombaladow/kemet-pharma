'use client'
import { useCart } from '@/lib/cart-context'
import { useRouter } from 'next/navigation'

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, isCartOpen, closeCart } = useCart()
  const router = useRouter()

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (!isCartOpen) return null

  function handleCheckout() {
    closeCart()
    router.push('/cart?step=form')
  }

  return (
    <div className="fixed inset-0 z-50">
      <div onClick={closeCart} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[var(--color-cream)] text-[var(--color-ink)] p-6 flex flex-col shadow-2xl">
        <div className="flex justify-between items-center border-b border-[var(--color-ink)]/10 pb-4">
          <span className="text-xs uppercase tracking-[0.2em] font-bold">
            {items.reduce((s, i) => s + i.quantity, 0)} Item(s)
          </span>
          <button onClick={closeCart} className="text-xs uppercase tracking-[0.2em] hover:text-[var(--color-gold)] font-bold">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-20 text-xs uppercase tracking-widest text-[var(--color-ink)]/40">
              Your bag is empty
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex justify-between items-start border-b border-[var(--color-ink)]/5 pb-4">
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-[var(--color-gold)] mt-1">{item.price * item.quantity} EGP</p>
                  <div className="flex items-center gap-3 border border-[var(--color-ink)]/20 rounded-full w-max px-3 py-1 mt-3">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="text-xs font-bold px-1">-</button>
                    <span className="text-[11px] font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="text-xs font-bold px-1">+</button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.productId)} className="text-red-600 text-xs">Remove</button>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-[var(--color-ink)]/10 pt-4 space-y-4">
          <div className="flex justify-between text-xs uppercase tracking-[0.2em] font-semibold">
            <span>Subtotal</span>
            <span>{total} EGP</span>
          </div>
          <button
            disabled={items.length === 0}
            onClick={handleCheckout}
            className="w-full bg-[var(--color-ink)] text-[var(--color-cream)] text-[10px] uppercase tracking-[0.25em] py-4 rounded-full hover:bg-[var(--color-gold)] transition font-semibold disabled:opacity-30"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  )
}