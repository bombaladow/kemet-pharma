import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name, price))')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-2xl mx-auto px-6 py-16 bg-[var(--color-cream)] text-[var(--color-ink)] min-h-screen">
      <h1 className="text-3xl font-light mb-8">My Orders</h1>
      {orders?.length === 0 || !orders ? (
        <p className="text-[var(--color-ink)]/60">No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border-b border-[var(--color-ink)]/10 py-4">
            <p>Status: {order.status}</p>
            <p className="text-[var(--color-gold)]">Total: {order.total} EGP</p>
          </div>
        ))
      )}
    </main>
  )
}