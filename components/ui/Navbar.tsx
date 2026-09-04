'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/cart-context'

export default function Navbar() {
  const { items, openCart } = useCart()
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="sticky top-[28px] z-40 bg-[var(--color-cream)]/90 backdrop-blur-md border-b border-[var(--color-ink)]/5 px-4 md:px-12 py-3 md:py-4 flex justify-between items-center text-[10px] md:text-[11px] tracking-[0.15em] md:tracking-[0.18em] uppercase font-semibold text-[var(--color-ink)]">
      <div className="flex space-x-4 md:space-x-10">
        <Link href="/shop" className="hover:text-[var(--color-gold)] transition">Shop</Link>
        <Link href="/#story" className="hidden sm:inline hover:text-[var(--color-gold)] transition">About</Link>
      </div>

      <Link href="/" className="relative w-[70px] h-[32px] md:w-[100px] md:h-[45px]">
        <Image src="/logo-black.png" alt="Kemet Pharma" fill className="object-contain" priority />
      </Link>

      <div className="flex items-center space-x-4 md:space-x-8">
        <Link href="/dashboard/profile" className="hidden sm:inline hover:text-[var(--color-gold)] transition">Account</Link>
        <button onClick={openCart} className="hover:text-[var(--color-gold)] transition">Cart ({count})</button>
      </div>
    </nav>
  )
}