export default function Loading() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20 bg-[var(--color-cream)] text-[var(--color-ink)] min-h-screen">
      <h1 className="text-4xl font-light mb-16 tracking-wide text-center">The Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="aspect-[3/4] bg-[var(--color-ink)]/5 border border-[var(--color-ink)]/10 animate-pulse mb-4" />
            <div className="h-4 w-2/3 bg-[var(--color-ink)]/10 animate-pulse" />
          </div>
        ))}
      </div>
    </main>
  )
}