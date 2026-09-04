'use client'
import { useCart } from '@/lib/cart-context'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef, Suspense } from 'react'
import gsap from 'gsap'

function CartContent() {
  const { items, removeItem, clearCart } = useCart()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<'cart' | 'form' | 'success'>(
    searchParams.get('step') === 'form' ? 'form' : 'cart'
  )
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const overlayRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id)
        setEmail(user.email || '')
      } else {
        router.push('/login')
      }
    })
  }, [])

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    setLoading(true)

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ customer_id: userId, total, status: 'pending' })
      .select()
      .single()

    if (orderError || !order) {
      setLoading(false)
      return
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
    }))

    await supabase.from('order_items').insert(orderItems)
    await supabase.from('customers').update({ full_name: fullName, phone, address }).eq('id', userId)

    setLoading(false)
    setStep('success')
  }

  useEffect(() => {
    if (step !== 'success' || !overlayRef.current || !boxRef.current) return

    const tl = gsap.timeline({
      onComplete: () => {
        clearCart()
        router.push('/dashboard/orders')
      },
    })

    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
      .fromTo(boxRef.current, { y: -100, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' })
      .to(boxRef.current, { opacity: 1, duration: 1.2 })
      .to(boxRef.current, { y: 300, opacity: 0, duration: 0.5, ease: 'power2.in' })
      .to(overlayRef.current, { opacity: 0, duration: 0.4 }, '-=0.2')
  }, [step])

  if (step === 'success') {
    return (
      <div ref={overlayRef} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-lg flex items-center justify-center">
        <div ref={boxRef} className="bg-[var(--color-cream)] rounded-2xl px-10 py-8 text-center shadow-2xl">
          <p className="text-2xl font-light text-[var(--color-ink)]">Order Confirmed</p>
          <p className="text-sm text-[var(--color-ink)]/60 mt-2">Thank you for shopping with us</p>
        </div>
      </div>
    )
  }

  if (step === 'form') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--color-cream)] text-[var(--color-ink)] px-6 py-16">
        <form onSubmit={handleConfirm} className="max-w-sm w-full flex flex-col gap-4">
          <h1 className="text-3xl font-light mb-4 text-center">Delivery Details</h1>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border border-[var(--color-ink)]/20 p-3 bg-transparent focus:border-[var(--color-gold)] outline-none"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-[var(--color-ink)]/20 p-3 bg-transparent focus:border-[var(--color-gold)] outline-none"
          />
          <textarea
            placeholder="Delivery Address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="border border-[var(--color-ink)]/20 p-3 bg-transparent focus:border-[var(--color-gold)] outline-none resize-none"
          />
          <input
            type="email"
            value={email}
            readOnly
            className="border border-[var(--color-ink)]/20 p-3 bg-[var(--color-ink)]/5 outline-none text-[var(--color-ink)]/60"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[var(--color-ink)] text-[var(--color-cream)] p-3 rounded-full hover:bg-[var(--color-gold)] transition mt-2"
          >
            {loading ? 'Placing Order...' : 'Confirm Order (Cash on Delivery)'}
          </button>
          <button
            type="button"
            onClick={() => setStep('cart')}
            className="text-sm underline text-[var(--color-ink)]/60"
          >
            Back to Cart
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16 bg-[var(--color-cream)] text-[var(--color-ink)] min-h-screen">
      <h1 className="text-3xl font-light mb-10 text-center">Your Cart</h1>
      {items.length === 0 ? (
        <p className="text-center text-[var(--color-ink)]/60">Your cart is empty</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between items-center border-b border-[var(--color-ink)]/10 py-4">
              <span>{item.name} × {item.quantity}</span>
              <span className="text-[var(--color-gold)]">{item.price * item.quantity} EGP</span>
              <button onClick={() => removeItem(item.productId)} className="text-red-600 text-sm">Remove</button>
            </div>
          ))}
          <p className="text-xl mt-6">Total: <span className="text-[var(--color-gold)]">{total} EGP</span></p>
          <button
            onClick={() => setStep('form')}
            className="w-full bg-[var(--color-ink)] text-[var(--color-cream)] px-6 py-3 rounded-full mt-6 hover:bg-[var(--color-gold)] transition"
          >
            Confirm Order (Cash on Delivery)
          </button>
        </>
      )}
    </main>
  )
}

export default function CartPage() {
  return (
    <Suspense fallback={null}>
      <CartContent />
    </Suspense>
  )
}