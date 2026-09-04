'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function NewProductPage() {
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: '', stock: '', slug: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    let imageUrl = null

    if (imageFile) {
      const filePath = `products/${Date.now()}-${imageFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, imageFile)

      if (!uploadError) {
        const { data } = supabase.storage.from('site-assets').getPublicUrl(filePath)
        imageUrl = data.publicUrl
      }
    }

    await supabase.from('products').insert({
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      stock: Number(form.stock),
      slug: form.slug,
      image_url: imageUrl,
    })

    setSaving(false)
    router.push('/admin/products')
  }

  return (
    <main className="max-w-lg mx-auto px-6 py-16">
      <h1 className="text-3xl font-light mb-8">Add Product</h1>
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-[var(--color-ink)]/20 p-3 bg-transparent focus:border-[var(--color-gold)] outline-none" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="border border-[var(--color-ink)]/20 p-3 bg-transparent focus:border-[var(--color-gold)] outline-none resize-none" />
        <input placeholder="Price (EGP)" type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border border-[var(--color-ink)]/20 p-3 bg-transparent focus:border-[var(--color-gold)] outline-none" />
        <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border border-[var(--color-ink)]/20 p-3 bg-transparent focus:border-[var(--color-gold)] outline-none" />
        <input placeholder="Stock" type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border border-[var(--color-ink)]/20 p-3 bg-transparent focus:border-[var(--color-gold)] outline-none" />
        <input placeholder="Slug (unique, e.g. perfume-2)" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="border border-[var(--color-ink)]/20 p-3 bg-transparent focus:border-[var(--color-gold)] outline-none" />

        <div>
          <label className="text-sm text-[var(--color-ink)]/60 block mb-2">Product Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
        </div>

        <button type="submit" disabled={saving} className="bg-[var(--color-ink)] text-[var(--color-cream)] p-3 rounded-full hover:bg-[var(--color-gold)] transition disabled:opacity-30">
          {saving ? 'Saving...' : 'Save Product'}
        </button>
      </form>
    </main>
  )
}