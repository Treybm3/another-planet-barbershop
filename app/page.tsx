'use client'

import { useState, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Phone, Clock, Menu, X, Scissors, Home as HomeIcon, CalendarDays } from 'lucide-react'
import Script from 'next/script'
import ChatWidget from './components/ChatWidget'
import PortfolioGallery from './components/PortfolioGallery'
import ReviewCarousel from './components/ReviewCarousel'

gsap.registerPlugin(ScrollTrigger)

const services = [
  { name: 'Burst Fade',     price: '$40', desc: 'Rounded fade bursting from the ear' },
  { name: 'Temp Fade',      price: '$40', desc: 'Sharp temple taper, clean finish' },
  { name: 'Full Cut',       price: '$45', desc: 'Complete cut shaped to your style' },
  { name: 'Skin Fade',      price: '$45', desc: 'Seamless blend down to the skin' },
  { name: 'Line Up',        price: '$20', desc: 'Crisp edges and clean lines' },
  { name: 'Face Touch Up',  price: '$20', desc: 'Edge up and facial clean-up' },
  { name: 'Beard Trim',     price: '$20', desc: 'Defined shape and sharp edges' },
  { name: 'Kids Cut',       price: '$35', desc: 'Patient, precise cuts for kids' },
]

export default function Home() {
  const [menuOpen, setMenuOpen]               = useState(false)
  const [bookHighlight, setBookHighlight]     = useState(false)
  const [firstName, setFirstName]             = useState('')
  const [lastName, setLastName]               = useState('')
  const [email, setEmail]                     = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [showErrors, setShowErrors]           = useState(false)
  const [booked, setBooked]                   = useState(false)
  const [cancelUrl, setCancelUrl]         = useState('')
  const [rescheduleUrl, setRescheduleUrl] = useState('')
  const lenisRef       = useRef<Lenis | null>(null)
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
        if (data?.event === 'calendly.event_scheduled') {
          const inviteeUri: string = data?.payload?.invitee?.uri ?? ''
          const uuid = inviteeUri.split('/').pop()
          if (uuid) {
            const cancel     = `https://calendly.com/cancellations/${uuid}`
            const reschedule = `https://calendly.com/reschedulings/${uuid}`
            setCancelUrl(cancel)
            setRescheduleUrl(reschedule)
            localStorage.setItem('anp_cancel_url', cancel)
            localStorage.setItem('anp_reschedule_url', reschedule)
          }
          setBooked(true)
          setTimeout(() => setBooked(false), 8000)
        }
      } catch {}
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  useEffect(() => {
    const c = localStorage.getItem('anp_cancel_url')
    const r = localStorage.getItem('anp_reschedule_url')
    if (c) setCancelUrl(c)
    if (r) setRescheduleUrl(r)
  }, [])

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

  function scrollTo(id: string) {
    lenisRef.current?.scrollTo(id, { duration: 1.2 })
    setMenuOpen(false)
  }

  function goToBook(serviceName?: string) {
    if (serviceName) setSelectedService(serviceName)
    scrollTo('#contact')
    if (highlightTimer.current) clearTimeout(highlightTimer.current)
    setTimeout(() => {
      setBookHighlight(true)
      highlightTimer.current = setTimeout(() => setBookHighlight(false), 2000)
    }, 900)
  }

  function openCalendly() {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !selectedService) {
      setShowErrors(true)
      return
    }
    setShowErrors(false)
    ;(window as any).Calendly?.initPopupWidget({
      url: 'https://calendly.com/treybrucem/kris-p-cuts',
      prefill: {
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        customAnswers: { a1: selectedService },
      },
    })
  }

  return (
    <main className="min-h-screen text-white pb-16 md:pb-0" style={{ background: 'var(--color-bg)' }}>

      {/* ── Booking confirmation banner ── */}
      {booked && (
        <div className="fixed top-6 left-1/2 z-[100] -translate-x-1/2 w-[90vw] max-w-md px-6 py-4 rounded-2xl shadow-2xl border flex items-start gap-3"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-cta)' }}>
          <span className="text-2xl">✅</span>
          <div className="flex-1">
            <p className="font-bold text-sm text-white">Appointment Scheduled!</p>
            <div className="flex gap-3 mt-2">
              {cancelUrl && (
                <a href={cancelUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold underline underline-offset-2" style={{ color: '#f87171' }}>
                  Cancel
                </a>
              )}
              {rescheduleUrl && (
                <a href={rescheduleUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold underline underline-offset-2" style={{ color: '#c084fc' }}>
                  Reschedule
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Navbar ── */}
      <header>
        <nav
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/[0.05]"
          style={{ background: 'var(--nav-bg)' }}
        >
          <div className="flex justify-between items-center px-6 md:px-14 py-4 max-w-7xl mx-auto">

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5"
            >
              <img src="/logo.jpg" alt="Another Planet Barbershop" className="w-8 h-8 rounded-full object-cover" />
              <span className="text-sm font-bold tracking-widest uppercase hidden sm:inline">Another Planet Barbershop</span>
              <span className="text-sm font-bold tracking-widest uppercase sm:hidden">Another Planet</span>
            </button>

            <div className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Home">
                <HomeIcon size={13} className="hover:text-white transition" />
              </button>
              <button onClick={() => scrollTo('#reviews')} className="hover:text-white transition">Reviews</button>
              <button onClick={() => scrollTo('#contact')} className="hover:text-white transition">Contact</button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Home"
                className="md:hidden"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <HomeIcon size={16} className="hover:text-white transition" />
              </button>
              <button
                onClick={() => goToBook()}
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

          {menuOpen && (
            <div className="md:hidden flex flex-col px-8 pb-6 gap-4 border-t border-white/[0.05]" style={{ color: 'var(--color-text-muted)' }}>
              <button onClick={() => scrollTo('#reviews')} className="text-left py-1 text-sm hover:text-white transition">Reviews</button>
              <button onClick={() => scrollTo('#contact')} className="text-left py-1 text-sm hover:text-white transition">Contact</button>
              <button
                onClick={() => goToBook()}
                className="text-white text-xs font-bold px-5 py-2.5 rounded-full tracking-widest uppercase w-fit mt-1"
                style={{ background: 'var(--color-cta)' }}
              >
                Book Now
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2 border-t border-white/[0.08]"
        style={{ background: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(12px)' }}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center gap-1 px-3 py-1" style={{ color: 'var(--color-text-muted)' }}>
          <HomeIcon size={18} />
          <span className="text-[10px] tracking-wide">Home</span>
        </button>
        <button onClick={() => scrollTo('#reviews')} className="flex flex-col items-center gap-1 px-3 py-1" style={{ color: 'var(--color-text-muted)' }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <span className="text-[10px] tracking-wide">Reviews</span>
        </button>
        <button onClick={() => scrollTo('#contact')} className="flex flex-col items-center gap-1 px-3 py-1" style={{ color: 'var(--color-text-muted)' }}>
          <CalendarDays size={18} />
          <span className="text-[10px] tracking-wide">Contact</span>
        </button>
        <button onClick={() => goToBook()} className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-white font-bold" style={{ background: 'var(--color-cta)' }}>
          <Scissors size={18} />
          <span className="text-[10px] tracking-wide">Book</span>
        </button>
      </nav>

      {/* ════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        <img
          src="/frontpic (2).jpg"
          alt="Another Planet Barbershop"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 42%', filter: 'brightness(0.88) contrast(1.1) saturate(1.05)' }}
        />

        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(8,8,8,0.75) 0%, rgba(8,8,8,0.45) 45%, rgba(8,8,8,0.1) 70%, transparent 100%)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 60%, var(--color-bg) 100%)' }}
        />

        <div className="relative z-10 px-8 md:px-14 max-w-xl w-full pt-24">

          <div className="hero-tag flex items-center gap-3 mb-6">
            <div className="h-px w-8" style={{ background: 'var(--color-cta)' }} />
            <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--color-cta)' }}>
              Lansing, Michigan
            </span>
          </div>

          <h1 className="hero-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight mb-6">
            Out Of This<br />
            <span style={{ color: '#a855f7' }}>World</span><br />
            Cuts &amp;<br />Fades.
          </h1>

          <p className="hero-sub text-base md:text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Precision fades, clean cuts, and a vibe<br />like no other place in Lansing.
          </p>

          <div className="hero-cta flex flex-col gap-3 mb-4">
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={() => goToBook()}
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
            <a
              href={cancelUrl || 'https://calendly.com/treybrucem/kris-p-cuts'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline underline-offset-4 w-fit hover:text-white transition"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              Cancel or Reschedule an Appointment
            </a>
          </div>

          <div className="hero-social flex items-center gap-3">
            <span className="text-xl tracking-wide drop-shadow-lg" style={{ color: '#f59e0b', textShadow: '0 0 12px rgba(245,158,11,0.6)' }}>★★★★★</span>
            <div className="h-4 w-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <span className="text-sm font-black">5.0</span>
            <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>Google Rating</span>
          </div>
        </div>

        <div className="absolute bottom-10 left-8 md:left-14 flex items-center gap-3" style={{ color: 'rgba(255,255,255,0.2)' }}>
          <div className="w-px h-10 bg-current animate-pulse" />
          <span className="text-[10px] tracking-[0.25em] uppercase">Scroll</span>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 2 — REVIEWS + PORTFOLIO
      ════════════════════════════════════════════ */}
      <section id="reviews" className="py-16 md:py-24 px-6 md:px-14 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-6xl mx-auto">

          <div className="flex items-center gap-3 mb-16" data-gsap="fade-up">
            <div className="h-px w-8" style={{ background: 'var(--color-cta)' }} />
            <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--color-cta)' }}>
              What Clients Say
            </span>
            <div className="h-px flex-1 max-w-[40px]" style={{ background: 'var(--color-border)' }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr] gap-16 items-start">

            <div>
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-10" data-gsap="fade-up">
                Real People.<br />
                <span style={{ color: 'var(--color-accent)' }}>Real Results.</span>
              </h2>
              <ReviewCarousel />
            </div>

            <div id="portfolio" className="lg:mt-16" data-gsap="fade-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8" style={{ background: 'var(--color-cta)' }} />
                <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--color-cta)' }}>
                  The Work
                </span>
              </div>
              <PortfolioGallery />
            </div>
          </div>

          {/* Services strip */}
          <div className="mt-20 pt-10 border-t" style={{ borderColor: 'var(--color-border)' }} data-gsap="fade-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8" style={{ background: 'var(--color-cta)' }} />
              <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--color-cta)' }}>Services & Pricing</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4">
              {services.map((s) => (
                <button
                  key={s.name}
                  onClick={() => goToBook(s.name)}
                  className="flex items-center justify-between border-b pb-3 text-left transition group"
                  style={{ borderColor: 'var(--color-border)' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-cta)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                >
                  <span className="text-sm transition group-hover:text-white" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.name}</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--color-accent)' }}>{s.price}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 3 — BOOKING + MAP
      ════════════════════════════════════════════ */}
      <section id="contact" className="py-16 md:py-24 px-6 md:px-14 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-14" data-gsap="fade-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8" style={{ background: 'var(--color-cta)' }} />
              <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--color-cta)' }}>Ready?</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">
              Book Your<br />
              <span style={{ color: 'var(--color-accent)' }}>Appointment.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* Booking form */}
            <div
              id="booking-form"
              className="p-8 rounded-2xl border"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              data-gsap="fade-up"
            >
              <div className="flex items-center gap-3 mb-7">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.12)' }}>
                  <Scissors size={12} style={{ color: 'var(--color-cta)' }} />
                </div>
                <span className="font-bold text-sm">Your Info</span>
              </div>

              <div className="flex flex-col gap-5">

                {/* First + Last name row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <input
                      type="text" placeholder="First Name" value={firstName}
                      onChange={e => { setFirstName(e.target.value); setShowErrors(false) }}
                      className="bg-transparent pb-2.5 text-white text-sm placeholder-slate-700 focus:outline-none transition border-b"
                      style={{ borderColor: showErrors && !firstName.trim() ? '#f87171' : 'rgba(255,255,255,0.09)' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-cta)')}
                      onBlur={e => (e.currentTarget.style.borderColor = showErrors && !firstName.trim() ? '#f87171' : 'rgba(255,255,255,0.09)')}
                    />
                    {showErrors && !firstName.trim() && <span className="text-xs" style={{ color: '#f87171' }}>Required</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      type="text" placeholder="Last Name" value={lastName}
                      onChange={e => { setLastName(e.target.value); setShowErrors(false) }}
                      className="bg-transparent pb-2.5 text-white text-sm placeholder-slate-700 focus:outline-none transition border-b"
                      style={{ borderColor: showErrors && !lastName.trim() ? '#f87171' : 'rgba(255,255,255,0.09)' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-cta)')}
                      onBlur={e => (e.currentTarget.style.borderColor = showErrors && !lastName.trim() ? '#f87171' : 'rgba(255,255,255,0.09)')}
                    />
                    {showErrors && !lastName.trim() && <span className="text-xs" style={{ color: '#f87171' }}>Required</span>}
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <input
                    type="email" placeholder="Email — for cancel/reschedule link" value={email}
                    onChange={e => { setEmail(e.target.value); setShowErrors(false) }}
                    className={`bg-transparent pb-2.5 text-white text-sm placeholder-slate-600 focus:outline-none transition border-b ${!showErrors && !email.trim() ? 'email-field-pulse' : ''}`}
                    style={{ borderColor: showErrors && !email.trim() ? '#f87171' : undefined }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-cta)'; e.currentTarget.classList.remove('email-field-pulse') }}
                    onBlur={e => { e.currentTarget.style.borderColor = showErrors && !email.trim() ? '#f87171' : ''; if (!email.trim() && !showErrors) e.currentTarget.classList.add('email-field-pulse') }}
                  />
                  {showErrors && !email.trim()
                    ? <span className="error-flash text-xs" style={{ color: '#f87171' }}>Field required</span>
                    : <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Used to send you a cancel/reschedule link</span>
                  }
                </div>

                {/* Service */}
                <div className="flex flex-col gap-1">
                  <select
                    value={selectedService}
                    onChange={e => { setSelectedService(e.target.value); setShowErrors(false) }}
                    className="bg-transparent pb-2.5 text-sm focus:outline-none transition border-b appearance-none cursor-pointer"
                    style={{
                      borderColor: showErrors && !selectedService ? '#f87171' : 'rgba(255,255,255,0.09)',
                      color: selectedService ? 'var(--color-text)' : '#4b5563',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-cta)')}
                    onBlur={e => (e.currentTarget.style.borderColor = showErrors && !selectedService ? '#f87171' : 'rgba(255,255,255,0.09)')}
                  >
                    <option value="" disabled style={{ background: '#0d1117' }}>Select a Service</option>
                    {services.map(s => (
                      <option key={s.name} value={s.name} style={{ background: '#0d1117' }}>{s.name} — {s.price}</option>
                    ))}
                  </select>
                  {showErrors && !selectedService && <span className="text-xs" style={{ color: '#f87171' }}>Required</span>}
                </div>

                {/* Calendly button */}
                <button
                  onClick={openCalendly}
                  className="mt-1 flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-full text-sm tracking-wide transition"
                  style={{
                    background: 'var(--color-cta)',
                    outline: bookHighlight ? '2px solid #c084fc' : '2px solid transparent',
                    outlineOffset: '4px',
                    transition: 'background 0.2s, outline 0.5s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-cta-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-cta)')}
                >
                  <CalendarDays size={14} />
                  Pick a Date &amp; Time
                </button>

                {/* Cancel / Reschedule */}
                <a
                  href={cancelUrl || 'https://calendly.com/treybrucem/kris-p-cuts'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-full border transition hover:text-white hover:border-white"
                  style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)' }}
                >
                  Cancel or Reschedule
                </a>
              </div>
            </div>

            {/* Map + info */}
            <div className="flex flex-col gap-5" data-gsap="fade-up">

              <div className="rounded-2xl overflow-hidden" style={{ height: '280px' }}>
                <iframe
                  src="https://maps.google.com/maps?q=4306+Martin+Luther+King+Blvd+Lansing+MI+48911&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%" height="100%"
                  style={{ border: 0, filter: 'grayscale(15%) contrast(1.05)' }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Another Planet Barbershop location"
                />
              </div>

              <div
                className="p-5 rounded-2xl border flex flex-col gap-4 text-sm"
                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-start gap-3">
                  <MapPin size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--color-cta)' }} />
                  <span style={{ color: 'var(--color-text-muted)' }}>4306 Martin Luther King Blvd, Lansing, MI 48911</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={14} className="shrink-0" style={{ color: 'var(--color-cta)' }} />
                  <span style={{ color: 'var(--color-text-muted)' }}>(517) 253-8053</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={14} className="shrink-0 mt-1" style={{ color: 'var(--color-cta)' }} />
                  <div className="flex flex-col gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {[
                      { day: 'Monday',    hours: '9AM – 6PM' },
                      { day: 'Tuesday',   hours: '9AM – 6PM' },
                      { day: 'Wednesday', hours: '9AM – 6PM' },
                      { day: 'Thursday',  hours: '9AM – 6PM' },
                      { day: 'Friday',    hours: '9AM – 6PM' },
                      { day: 'Saturday',  hours: '9AM – 6PM' },
                      { day: 'Sunday',    hours: '10AM – 12PM' },
                    ].map(({ day, hours }) => (
                      <div key={day} className="flex items-center justify-between gap-6">
                        <span className="font-medium" style={{ color: 'var(--color-text)' }}>{day}</span>
                        <span style={{ color: 'var(--color-accent)' }}>{hours}</span>
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
            <Scissors size={11} style={{ color: 'var(--color-cta)' }} />
            <span className="font-semibold">Another Planet Barbershop</span>
          </div>
          <span>© 2025 · 4306 MLK Blvd, Lansing, MI 48911 · (517) 253-8053</span>
        </div>
      </footer>

      <ChatWidget />
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
    </main>
  )
}
