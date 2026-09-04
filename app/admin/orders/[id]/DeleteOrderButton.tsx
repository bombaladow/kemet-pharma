'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteOrderButton({ orderId }: { orderId: string }) {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    if (!confirm('Delete this order permanently?')) return
    setDeleting(true)

    await supabase.from('order_items').delete().eq('order_id', orderId)
    await supabase.from('orders').delete().eq('id', orderId)

    router.push('/admin/orders')
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-red-600 text-sm underline self-start disabled:opacity-40"
    >
      {deleting ? 'Deleting...' : 'Delete Order'}
    </button>
  )
}