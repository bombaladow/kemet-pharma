'use client'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.push('/dashboard/profile')
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else router.push('/dashboard/profile')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-cream)] text-[var(--color-ink)] px-6">
      <div className="max-w-sm w-full">
        <h1 className="text-3xl font-light mb-8 text-center">Welcome Back</h1>
        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[var(--color-ink)]/20 p-3 bg-transparent focus:border-[var(--color-gold)] outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[var(--color-ink)]/20 p-3 bg-transparent focus:border-[var(--color-gold)] outline-none"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button onClick={handleLogin} className="bg-[var(--color-ink)] text-[var(--color-cream)] p-3 hover:bg-[var(--color-gold)] transition mt-2">
            Log In
          </button>
          <button onClick={handleSignup} className="border border-[var(--color-ink)]/30 p-3 hover:border-[var(--color-gold)] transition">
            Sign Up
          </button>
        </form>
      </div>
    </main>
  )
}