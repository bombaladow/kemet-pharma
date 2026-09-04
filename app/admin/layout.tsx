import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: customer } = await supabase
    .from('customers')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!customer?.is_admin) redirect('/')

  return (
    <div className="bg-[var(--color-cream)] text-[var(--color-ink)] min-h-screen">
      <div className="border-b border-[var(--color-ink)]/10 px-8 py-4 flex gap-6 text-sm uppercase tracking-wide">
        <a href="/admin">Dashboard</a>
        <a href="/admin/hero">Hero Image</a>
        <a href="/admin/products">Products</a>
        <a href="/admin/orders">Orders</a>
      </div>
      {children}
    </div>
  )
}