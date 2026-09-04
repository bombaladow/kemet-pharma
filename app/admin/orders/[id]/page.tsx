import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import OrderStatusSelect from '../OrderStatusSelect'
import DeleteOrderButton from './DeleteOrderButton'

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, customers(full_name, phone, address), order_items(quantity, price, products(name))')
    .eq('id', id)
    .single()

  if (!order) notFound()

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-light mb-8">Order Details</h1>

      <div className="border border-[var(--color-ink)]/10 p-6 flex flex-col gap-6">
        <div>
          <p className="text-xs uppercase text-[var(--color-ink)]/50 mb-1">Order ID</p>
          <p className="text-sm">{order.id}</p>
        </div>

        <div>
          <p className="text-xs uppercase text-[var(--color-ink)]/50 mb-1">Placed On</p>
          <p className="text-sm">{new Date(order.created_at).toLocaleString()}</p>
        </div>

        <div>
          <p className="text-xs uppercase text-[var(--color-ink)]/50 mb-1">Customer</p>
          <p className="font-semibold">{order.customers?.full_name || 'Unknown'}</p>
          <p className="text-sm text-[var(--color-ink)]/70">{order.customers?.phone}</p>
          <p className="text-sm text-[var(--color-ink)]/70">{order.customers?.address}</p>
        </div>

        <div>
          <p className="text-xs uppercase text-[var(--color-ink)]/50 mb-2">Items</p>
          <div className="flex flex-col gap-1">
            {order.order_items?.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.products?.name} × {item.quantity}</span>
                <span className="text-[var(--color-gold)]">{item.price * item.quantity} EGP</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-[var(--color-ink)]/10 pt-4">
          <p className="text-lg">Total: <span className="text-[var(--color-gold)]">{order.total} EGP</span></p>
          <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
        </div>

        <DeleteOrderButton orderId={order.id} />
      </div>
    </main>
  )
}