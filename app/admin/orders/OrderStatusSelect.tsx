'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const statuses = ['pending', 'shipped', 'delivered', 'cancelled']

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const supabase = createClient()

  async function handleChange(newStatus: string) {
    setStatus(newStatus)
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      className="border border-[var(--color-ink)]/20 p-2 text-sm bg-transparent"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  )
}