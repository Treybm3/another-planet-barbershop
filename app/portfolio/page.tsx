'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Phone, Clock, Scissors, X } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import PortfolioGallery from '../components/PortfolioGallery'
import ChatWidget from '../components/ChatWidget'

gsap.registerPlugin(ScrollTrigger)

const services = [
  { name: 'Regular Cut',  price: '$25' },
  { name: 'Skin Fade',    price: '$30' },
  { name: 'Taper Fade',   price: '$30' },
  { name: 'Temp Fade',    price: '$35' },
  { name: 'Cut & Beard',  price: '$45' },
  { name: 'Beard Trim',   price: '$15' },
  { name: 'Kids Cut',     price: '$20' },
  { name: 'Line Up',      price: '$15' },
]

export default function PortfolioPage() {
  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [message, setMessage]     = useState('')
  const [formService, setFormService] = useState('')
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      prevent: (node: Element) => node.nodeName === 'IFRAME',
    } as any)
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy() }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.utils.toArray<HTMLElement>('[data-gsap="fade-up"]').forEach(el => {
      gsap.from(el, {
        y: 35, opacity: 0, duration: 0.65, ease: 'power2.out',
        immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      })
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  // Scroll to #contact if hash present on load
  useEffect(() => {
    if (window.location.hash === '#contact') {
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const id = toast.loading('Sending…')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message: `Service: ${formService || 'Not specified'}\n\n${message}` }),
      })
      if (!res.ok) throw new Error()
      toast.success("Sent! Kris will be in touch soon.", { id, duration: 4000 })
      setName(''); setEmail(''); setMessage(''); setFormService('')
    } catch {
      toast.error('Something went wrong. Try again.', { id })
    }
  }

  return (
    <main style={{ background: 'var(--color-bg)' }} className="min-h-screen text-white">
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)' },
          success: { iconTheme: { primary: 'var(--color-accent)', secondary: '#fff' } },
        }}
      />
      <Navbar />

      {/* ── Page header ── */}
      <section className="pt-36 pb-16 px-8 md:px-14">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div data-gsap="fade-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8" style={{ background: 'var(--color-accent)' }} />
              <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--color-accent)' }}>
                Page 03
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              The Work.<br />
              <span style={{ color: 'var(--color-accent)' }}>Book Your Cut.</span>
            </h1>
          </div>
          <p className="text-sm max-w-xs leading-relaxed md:text-right" style={{ color: 'var(--color-text-muted)' }} data-gsap="fade-up">
            Browse the portfolio, then fill out<br />the form to lock in your appointment.
          </p>
        </div>
      </section>

      {/* ── Portfolio + Booking side by side ── */}
      <section className="py-12 px-8 md:px-14 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-16 items-start">

          {/* Left — Gallery slideshow */}
          <div data-gsap="fade-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8" style={{ background: 'var(--color-accent)' }} />
              <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--color-accent)' }}>Portfolio</span>
            </div>
            <PortfolioGallery />
          </div>

          {/* Right — Quick info stacked above form */}
          <div id="contact" className="flex flex-col gap-6">

            {/* Location card */}
            <div
              className="p-5 rounded-2xl border flex flex-col gap-4 text-sm"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              data-gsap="fade-up"
            >
              <div className="flex items-start gap-3">
                <MapPin size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--color-accent)' }} />
                <span style={{ color: 'var(--color-text-muted)' }}>6231 Bishop Rd, Lansing, MI 48911</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={14} className="shrink-0" style={{ color: 'var(--color-accent)' }} />
                {/* TODO: Replace with real phone number */}
                <span style={{ color: 'var(--color-text-muted)' }}>(517) 000-0000</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--color-accent)' }} />
                <div style={{ color: 'var(--color-text-muted)' }}>
                  <div>Tue – Sat · 9AM – 6PM</div>
                  <div className="opacity-40 mt-0.5">Sun – Mon · Closed</div>
                </div>
              </div>
            </div>

            {/* Booking form */}
            <div
              className="p-6 rounded-2xl border"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              data-gsap="fade-up"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.12)' }}>
                  <Scissors size={11} style={{ color: 'var(--color-accent)' }} />
                </div>
                <span className="text-sm font-bold">Request an Appointment</span>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required
                  className="bg-transparent pb-2.5 text-white text-sm placeholder-slate-700 focus:outline-none transition border-b"
                  style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                <input
                  type="email" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="bg-transparent pb-2.5 text-white text-sm placeholder-slate-700 focus:outline-none transition border-b"
                  style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                <select
                  value={formService} onChange={e => setFormService(e.target.value)}
                  className="bg-transparent pb-2.5 text-sm focus:outline-none transition border-b appearance-none cursor-pointer"
                  style={{ borderColor: 'rgba(255,255,255,0.08)', color: formService ? 'var(--color-text)' : '#4b5563' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                >
                  <option value="" disabled style={{ background: '#0d1117' }}>Select a Service</option>
                  {services.map(s => (
                    <option key={s.name} value={s.name} style={{ background: '#0d1117' }}>{s.name} — {s.price}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Preferred day/time or anything else…" value={message} onChange={e => setMessage(e.target.value)}
                  className="bg-transparent pb-2.5 text-white text-sm placeholder-slate-700 h-20 focus:outline-none transition resize-none border-b"
                  style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                <button
                  type="submit"
                  className="mt-1 text-white font-bold py-3.5 rounded-full text-sm transition"
                  style={{ background: 'var(--color-accent)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-accent-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-accent)')}
                >
                  Request Appointment
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── Full-width map ── */}
      <section className="px-8 md:px-14 pb-20 border-t pt-16" style={{ borderColor: 'var(--color-border)' }} data-gsap="fade-up">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8" style={{ background: 'var(--color-accent)' }} />
            <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--color-accent)' }}>Find Us</span>
          </div>
          <div className="rounded-2xl overflow-hidden w-full" style={{ height: '320px' }}>
            <iframe
              src="https://maps.google.com/maps?q=6231+Bishop+Rd+Lansing+MI+48911&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%" height="100%"
              style={{ border: 0, filter: 'grayscale(15%) contrast(1.05)' }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kris Professional Cuts location"
            />
          </div>
        </div>
      </section>

      <footer className="px-8 md:px-14 py-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-6xl mx-auto flex justify-between items-center text-xs" style={{ color: 'var(--color-text-dim)' }}>
          <span>Kris Professional Cuts</span>
          <span>© 2025 · Lansing, Michigan</span>
        </div>
      </footer>

      <ChatWidget />
    </main>
  )
}
