import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[var(--color-cream)] text-[var(--color-ink)] px-6 text-center">
      <h1 className="text-6xl font-light">404</h1>
      <p className="text-[var(--color-ink)]/70">This page doesn't exist.</p>
      <Link
        href="/"
        className="border border-[var(--color-ink)] px-6 py-3 text-sm tracking-wide hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition"
      >
        Back to Home
      </Link>
    </main>
  )
}