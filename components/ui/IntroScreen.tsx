'use client'
import { useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'

export default function IntroScreen({ onFinish }: { onFinish: () => void }) {
  const [visible, setVisible] = useState(true)

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false)
        onFinish()
      },
    })

    tl.fromTo(
      '.intro-logo',
      { opacity: 0, scale: 0.85, y: 10 },
      { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power2.out' }
    )
      .from('.intro-slogan', { opacity: 0, y: 10, duration: 0.8 }, '-=0.3')
      .to('.intro-screen', { opacity: 0, duration: 0.8, delay: 1 })
  }, [])

  if (!visible) return null

  return (
    <div className="intro-screen fixed inset-0 z-50 bg-[var(--color-ink)] flex flex-col items-center justify-center gap-6">
      <div className="intro-logo relative w-[220px] h-[220px]">
        <Image src="/logo-white.png" alt="Kemet Pharma" fill className="object-contain" priority />
      </div>
      <p className="intro-slogan text-[var(--color-cream)]/70 tracking-wide text-sm">
        Pure Nile Beauty
      </p>
    </div>
  )
}