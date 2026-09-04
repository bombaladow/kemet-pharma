import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <main className="max-w-2xl mx-auto px-6 py-16 bg-[var(--color-cream)] text-[var(--color-ink)] min-h-screen">
      <h1 className="text-3xl font-light mb-8">My Account</h1>
      <p className="text-lg">Email: {user.email}</p>
      <p className="text-lg mt-2">Name: {customer?.full_name || 'Not set'}</p>
    </main>
  )
}