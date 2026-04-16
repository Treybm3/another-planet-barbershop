'use client'

import { useState, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Phone, Clock, Menu, X, Scissors, Home as HomeIcon } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import ChatWidget from './components/ChatWidget'
import PortfolioGallery from './components/PortfolioGallery'
import ReviewCarousel from './components/ReviewCarousel'

gsap.registerPlugin(ScrollTrigger)

const services = [
  { name: 'Regular Cut',  price: '$25', desc: 'Classic cut shaped to your style' },
  { name: 'Skin Fade',    price: '$30', desc: 'Seamless blend down to the skin' },
  { name: 'Taper Fade',   price: '$30', desc: 'Smooth taper from full to tight' },
  { name: 'Temp Fade',    price: '$35', desc: 'Sharp temple taper, clean finish' },
  { name: 'Cut & Beard',  price: '$45', desc: 'Full grooming — cut plus beard' },
  { name: 'Beard Trim',   price: '$15', desc: 'Sharp lines and defined edges' },
  { name: 'Kids Cut',     price: '$20', desc: 'Patient, precise cuts for kids' },
  { name: 'Line Up',      price: '$15', desc: 'Crisp edges and clean lines' },
]

export default function Home() {
  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [message, setMessage]     = useState('')
  const [formService, setFormService] = useState('')
  const [menuOpen, setMenuOpen]   = useState(false)
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

    // Hero — slide in from left
    gsap.timeline({ delay: 0.1 })
      .from('.hero-tag',     { x: -20, opacity: 0, duration: 0.5,  ease: 'power2.out' })
      .from('.hero-heading', { x: -30, opacity: 0, duration: 0.75, ease: 'power3.out' }, '-=0.2')
      .from('.hero-sub',     { x: -20, opacity: 0, duration: 0.55, ease: 'power2.out' }, '-=0.35')
      .from('.hero-cta',     { x: -16, opacity: 0, duration: 0.45, ease: 'power2.out' }, '-=0.3')
      .from('.hero-social',  { x: -12, opacity: 0, duration: 0.4,  ease: 'power2.out' }, '-=0.25')

    gsap.utils.toArray<HTMLElement>('[data-gsap="fade-up"]').forEach(el => {
      gsap.from(el, {
        y: 30, opacity: 0, duration: 0.6, ease: 'power2.out',
        immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
      })
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
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

  function scrollTo(id: string) {
    lenisRef.current?.scrollTo(id, { duration: 1.2 })
    setMenuOpen(false)
  }

  return (
    <main className="min-h-screen text-white" style={{ background: 'var(--color-bg)' }}>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)' },
          success: { iconTheme: { primary: 'var(--color-accent)', secondary: '#fff' } },
        }}
      />

      {/* ── Navbar ── */}
      <header>
        <nav
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/[0.05]"
          style={{ background: 'var(--nav-bg)' }}
        >
          <div className="flex justify-between items-center px-8 md:px-14 py-4 max-w-7xl mx-auto">

            {/* Brand */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5"
            >
              <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center" style={{ borderColor: 'var(--color-accent)' }}>
                <Scissors size={11} style={{ color: 'var(--color-accent)' }} />
              </div>
              <span className="text-sm font-bold tracking-widest uppercase">Kris Professional Cuts</span>
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Home">
                <HomeIcon size={13} className="hover:text-white transition" />
              </button>
              <button onClick={() => scrollTo('#reviews')}  className="hover:text-white transition">Reviews</button>
              <button onClick={() => scrollTo('#contact')}  className="hover:text-white transition">Contact</button>
            </div>

            {/* Book + hamburger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollTo('#contact')}
                className="hidden md:block text-white text-xs font-bold px-5 py-2.5 rounded-full tracking-widest uppercase transition"
                style={{ background: 'var(--color-cta)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-cta-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-cta)')}
              >
                Book Now
              </button>
              <button
                className="md:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden flex flex-col px-8 pb-6 gap-4 border-t border-white/[0.05]" style={{ color: 'var(--color-text-muted)' }}>
              <button onClick={() => scrollTo('#reviews')}  className="text-left py-1 text-sm hover:text-white transition">Reviews</button>
              <button onClick={() => scrollTo('#contact')}  className="text-left py-1 text-sm hover:text-white transition">Contact</button>
              <button
                onClick={() => scrollTo('#contact')}
                className="text-white text-xs font-bold px-5 py-2.5 rounded-full tracking-widest uppercase w-fit mt-1"
                style={{ background: 'var(--color-cta)' }}
              >
                Book Now
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* ════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Background photo — clearer than before */}
        <img
          src="/kris cuts.jpg"
          alt="Kris cutting hair"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.62)', transform: 'scale(1.03)', objectPosition: 'center 15%' }}
        />

        {/* Gradient — readable text on left, image visible through right AND left edge */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(7,9,15,0.88) 0%, rgba(7,9,15,0.6) 38%, rgba(7,9,15,0.15) 65%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 60%, var(--color-bg) 100%)' }}
        />

        {/* Content — LEFT side */}
        <div className="relative z-10 px-8 md:px-14 max-w-xl w-full pt-24">

          <div className="hero-tag flex items-center gap-3 mb-6">
            <div className="h-px w-8" style={{ background: 'var(--color-accent)' }} />
            <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--color-accent)' }}>
              Lansing, Michigan
            </span>
          </div>

          <h1 className="hero-heading text-5xl md:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight mb-6">
            We Will<br />
            Make You<br />
            <span style={{ color: 'var(--color-accent)' }}>Look Your<br />Best.</span>
          </h1>

          <p className="hero-sub text-base md:text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Precision barbering, real community,<br />and cuts you'll come back for.
          </p>

          <div className="hero-cta flex items-center gap-4 flex-wrap mb-4">
            <button
              onClick={() => scrollTo('#contact')}
              className="text-white font-bold px-8 py-4 rounded-full text-sm tracking-wide transition shadow-lg"
              style={{ background: 'var(--color-cta)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-cta-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-cta)')}
            >
              Book an Appointment
            </button>
            <span
              className="text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full border"
              style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
            >
              Walk-ins Welcome
            </span>
          </div>

          {/* 5-star + review count */}
          <div className="hero-social flex items-center gap-3">
            <span className="text-xl tracking-wide drop-shadow-lg" style={{ color: '#f59e0b', textShadow: '0 0 12px rgba(245,158,11,0.6)' }}>★★★★★</span>
            <div className="h-4 w-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <span className="text-sm font-black">150+</span>
            <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>Google Reviews</span>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-8 md:left-14 flex items-center gap-3" style={{ color: 'rgba(255,255,255,0.2)' }}>
          <div className="w-px h-10 bg-current animate-pulse" />
          <span className="text-[10px] tracking-[0.25em] uppercase">Scroll</span>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 2 — REVIEWS + PORTFOLIO
      ════════════════════════════════════════════ */}
      <section id="reviews" className="py-24 px-8 md:px-14 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-6xl mx-auto">

          {/* Section label */}
          <div className="flex items-center gap-3 mb-16" data-gsap="fade-up">
            <div className="h-px w-8" style={{ background: 'var(--color-accent)' }} />
            <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--color-accent)' }}>
              What Clients Say
            </span>
            <div className="h-px flex-1 max-w-[40px]" style={{ background: 'var(--color-border)' }} />
          </div>

          {/* Asymmetric grid — reviews left wider, portfolio right */}
          <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr] gap-16 items-start">

            {/* Left — reviews carousel + heading */}
            <div>
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-10" data-gsap="fade-up">
                Real People.<br />
                <span style={{ color: 'var(--color-accent)' }}>Real Results.</span>
              </h2>
              <ReviewCarousel />
            </div>

            {/* Right — portfolio slideshow, offset down */}
            <div id="portfolio" className="lg:mt-16" data-gsap="fade-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8" style={{ background: 'var(--color-accent)' }} />
                <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--color-accent)' }}>
                  The Work
                </span>
              </div>
              <PortfolioGallery />
            </div>
          </div>

          {/* Services strip */}
          <div className="mt-20 pt-10 border-t" style={{ borderColor: 'var(--color-border)' }} data-gsap="fade-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8" style={{ background: 'var(--color-accent)' }} />
              <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--color-accent)' }}>Services & Pricing</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4">
              {services.map((s) => (
                <div key={s.name} className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.name}</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--color-accent)' }}>{s.price}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 3 — BOOKING + MAP
      ════════════════════════════════════════════ */}
      <section id="contact" className="py-24 px-8 md:px-14 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-6xl mx-auto">

          {/* Asymmetric header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14" data-gsap="fade-up">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8" style={{ background: 'var(--color-accent)' }} />
                <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--color-accent)' }}>Ready?</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                Book Your<br />
                <span style={{ color: 'var(--color-accent)' }}>Appointment.</span>
              </h2>
            </div>
            <div className="text-sm leading-relaxed md:text-right" style={{ color: 'var(--color-text-muted)' }}>
              Fill out the form and Kris<br />will reach out to confirm your time.
            </div>
          </div>

          {/* Two-column: form left, map right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* Booking form */}
            <div
              className="p-8 rounded-2xl border"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              data-gsap="fade-up"
            >
              <div className="flex items-center gap-3 mb-7">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.12)' }}>
                  <Scissors size={12} style={{ color: 'var(--color-accent)' }} />
                </div>
                <span className="font-bold text-sm">Request an Appointment</span>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <input
                  type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required
                  className="bg-transparent pb-2.5 text-white text-sm placeholder-slate-700 focus:outline-none transition border-b"
                  style={{ borderColor: 'rgba(255,255,255,0.09)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)')}
                />
                <input
                  type="email" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="bg-transparent pb-2.5 text-white text-sm placeholder-slate-700 focus:outline-none transition border-b"
                  style={{ borderColor: 'rgba(255,255,255,0.09)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)')}
                />
                <select
                  value={formService} onChange={e => setFormService(e.target.value)}
                  className="bg-transparent pb-2.5 text-sm focus:outline-none transition border-b appearance-none cursor-pointer"
                  style={{ borderColor: 'rgba(255,255,255,0.09)', color: formService ? 'var(--color-text)' : '#4b5563' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)')}
                >
                  <option value="" disabled style={{ background: '#0d1117' }}>Select a Service</option>
                  {services.map(s => (
                    <option key={s.name} value={s.name} style={{ background: '#0d1117' }}>{s.name} — {s.price}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Preferred day/time, or anything else…" value={message} onChange={e => setMessage(e.target.value)}
                  className="bg-transparent pb-2.5 text-white text-sm placeholder-slate-700 h-24 focus:outline-none transition resize-none border-b"
                  style={{ borderColor: 'rgba(255,255,255,0.09)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)')}
                />
                <button
                  type="submit"
                  className="mt-1 text-white font-bold py-3.5 rounded-full text-sm tracking-wide transition"
                  style={{ background: 'var(--color-cta)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-cta-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-cta)')}
                >
                  Book Appointment
                </button>
              </form>
            </div>

            {/* Map + info stacked */}
            <div className="flex flex-col gap-5" data-gsap="fade-up">

              {/* Google Map */}
              <div className="rounded-2xl overflow-hidden" style={{ height: '280px' }}>
                <iframe
                  src="https://maps.google.com/maps?q=6231+Bishop+Rd+Lansing+MI+48911&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%" height="100%"
                  style={{ border: 0, filter: 'grayscale(15%) contrast(1.05)' }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Kris Professional Cuts location"
                />
              </div>

              {/* Info card */}
              <div
                className="p-5 rounded-2xl border flex flex-col gap-4 text-sm"
                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-start gap-3">
                  <MapPin size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--color-accent)' }} />
                  <span style={{ color: 'var(--color-text-muted)' }}>6231 Bishop Rd, Lansing, MI 48911</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={14} className="shrink-0" style={{ color: 'var(--color-accent)' }} />
                  {/* TODO: Replace with Kris's real phone number */}
                  <span style={{ color: 'var(--color-text-muted)' }}>(517) 505-2039</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={14} className="shrink-0 mt-1" style={{ color: 'var(--color-accent)' }} />
                  <div className="flex flex-col gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {[
                      { day: 'Tuesday',   hours: '9AM – 6PM' },
                      { day: 'Wednesday', hours: '9AM – 6PM' },
                      { day: 'Thursday',  hours: '9AM – 6PM' },
                      { day: 'Friday',    hours: '9AM – 6PM' },
                      { day: 'Saturday',  hours: '9AM – 6PM' },
                      { day: 'Sunday',    hours: 'Closed',    closed: true },
                      { day: 'Monday',    hours: 'Closed',    closed: true },
                    ].map(({ day, hours, closed }) => (
                      <div key={day} className="flex items-center justify-between gap-6">
                        <span className="font-medium" style={{ color: closed ? 'var(--color-text-dim)' : 'var(--color-text)' }}>{day}</span>
                        <span style={{ color: closed ? 'var(--color-text-dim)' : 'var(--color-accent)' }}>{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-8 md:px-14 py-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs" style={{ color: 'var(--color-text-dim)' }}>
          <div className="flex items-center gap-2">
            <Scissors size={11} style={{ color: 'var(--color-accent)' }} />
            <span className="font-semibold">Kris Professional Cuts</span>
          </div>
          <span>© 2025 · 6231 Bishop Rd, Lansing, MI · Tue–Sat 9AM–6PM · Closed Sun &amp; Mon</span>
        </div>
      </footer>

      <ChatWidget />
    </main>
  )
}
