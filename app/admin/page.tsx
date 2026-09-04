import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminOrdersPage() {
  const supabase = await createClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*, customers(full_name, phone)')
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-light mb-8">Orders</h1>
      <div className="flex flex-col gap-3">
        {orders?.length === 0 || !orders ? (
          <p className="text-[var(--color-ink)]/60">No orders yet</p>
        ) : (
          orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="flex justify-between items-center border border-[var(--color-ink)]/10 p-4 hover:border-[var(--color-gold)] transition"
            >
              <div>
                <p className="font-semibold">{order.customers?.full_name || 'Unknown'}</p>
                <p className="text-sm text-[var(--color-ink)]/60">{order.customers?.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-[var(--color-gold)]">{order.total} EGP</p>
                <p className="text-xs uppercase text-[var(--color-ink)]/50">{order.status}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  )
}