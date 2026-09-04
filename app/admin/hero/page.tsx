'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function HeroAdminPage() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'hero_image_url')
      .single()
      .then(({ data }) => setCurrentUrl(data?.value || null))
  }, [])

  async function handleUpload() {
    if (!file) return
    setUploading(true)

    const filePath = `hero-${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      setUploading(false)
      return
    }

    const { data: publicUrlData } = supabase.storage.from('site-assets').getPublicUrl(filePath)
    const publicUrl = publicUrlData.publicUrl

    await supabase
      .from('site_settings')
      .upsert({ key: 'hero_image_url', value: publicUrl })

    setCurrentUrl(publicUrl)
    setFile(null)
    setUploading(false)
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-light mb-8">Hero Image</h1>

      {currentUrl && (
        <div className="mb-6">
          <p className="text-sm text-[var(--color-ink)]/60 mb-2">Current Image:</p>
          <img src={currentUrl} alt="Current hero" className="w-full rounded-2xl" />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 block"
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-[var(--color-ink)] text-[var(--color-cream)] px-6 py-3 rounded-full hover:bg-[var(--color-gold)] transition disabled:opacity-30"
      >
        {uploading ? 'Uploading...' : 'Upload New Image'}
      </button>
    </main>
  )
}