'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function AnimatedSection({ children, className }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from(ref.current, {
      opacity: 0,
      y: 60,
      duration: 1,
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 80%',
      },
    })
  }, { scope: ref })

  return <div ref={ref} className={className}>{children}</div>
}