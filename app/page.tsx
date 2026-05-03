'use client'

import { useState, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Phone, Clock, Menu, X, Scissors, Home as HomeIcon, CalendarDays } from 'lucide-react'
import ChatWidget from './components/ChatWidget'
import MarathonBanner from './components/MarathonBanner'
import MarathonIntro from './components/MarathonIntro'
import PortfolioGallery from './components/PortfolioGallery'
import ReviewCarousel from './components/ReviewCarousel'

gsap.registerPlugin(ScrollTrigger)

const services = [
  { name: 'Burst Fade',     price: '$50', desc: 'Rounded fade bursting from the ear' },
  { name: 'Temp Fade',      price: '$50', desc: 'Sharp temple taper, clean finish' },
  { name: 'Full Cut',       price: '$50', desc: 'Complete cut shaped to your style' },
  { name: 'Skin Fade',      price: '$50', desc: 'Seamless blend down to the skin' },
  { name: 'Line Up',        price: '$25', desc: 'Crisp edges and clean lines' },
  { name: 'Face Touch Up',  price: '$50', desc: 'Edge up and facial clean-up' },
  { name: 'Beard Trim',     price: '$50', desc: 'Defined shape and sharp edges' },
  { name: 'Kids Cut',       price: '$35', desc: 'Patient, precise cuts for kids' },
]

export default function Home() {
  const [available, setAvailable] = useState<boolean | null>(null)
  const [menuOpen, setMenuOpen]   = useState(false)
  const lenisRef = useRef<Lenis | null>(null)
  const BOOKSY_URL = 'https://booksy.com/en-us/1685341_another-planet-barber-co_barber-shop_134615_lansing'

  useEffect(() => {
    fetch('/api/availability', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => setAvailable(d.available))
      .catch(() => setAvailable(null))
  }, [])

  useEffect(() => {
    fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'view' }) }).catch(() => {})
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

  function goToBook() {
    fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'booksy' }) }).catch(() => {})
    window.open(BOOKSY_URL, '_blank')
  }

  return (
    <main className="min-h-screen text-white pb-16 md:pb-0" style={{ background: 'var(--color-bg)' }}>
      <MarathonIntro />


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

          <h1 className="hero-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight mb-5">
            <span style={{ color: '#e8dcc8' }}>Out Of This</span><br />
            <span style={{ color: '#f59e0b', textShadow: '0 0 30px rgba(245,158,11,0.4)' }}>World</span><br />
            <span style={{ color: '#e8dcc8' }}>Cuts &amp;<br />Fades.</span>
          </h1>

          {/* Socials — visible right away under the title */}
          <div className="hero-sub flex items-center gap-5 mb-7">
            {[
              { href: 'https://www.instagram.com/anotherplanetwill/', label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
              { href: 'https://www.facebook.com/AnotherPlanetOfCutsandStyles', label: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              { href: 'https://www.tiktok.com/@anotherplanetbarberco', label: 'TikTok', path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
            ].map(({ href, label, path }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="transition-transform hover:scale-110 active:scale-95"
                style={{ color: '#f97316', filter: 'drop-shadow(0 0 8px rgba(249,115,22,0.6))' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d={path} /></svg>
              </a>
            ))}
          </div>

          <p className="hero-sub text-base md:text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Precision fades, clean cuts, and a vibe<br />like no other place in Lansing.
          </p>

          {available !== null && (
            <div className="hero-cta flex items-center gap-2 mb-4">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: available ? '#4ade80' : '#f87171', boxShadow: available ? '0 0 6px #4ade80' : 'none' }}
              />
              <span className="text-xs font-semibold tracking-wide" style={{ color: available ? '#4ade80' : '#f87171' }}>
                {available ? 'Taking Walk-ins Now' : 'Not Taking Walk-ins'}
              </span>
            </div>
          )}

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
              href={BOOKSY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline underline-offset-4 w-fit hover:text-white transition"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              Cancel or Reschedule an Appointment
            </a>
          </div>

          <div className="hero-social flex flex-col gap-1.5">
            <div className="flex gap-px">
              {[0,1,2,3,4].map(i => (
                <span key={i} style={{ color: '#f59e0b', fontSize: '16px', lineHeight: 1, textShadow: '0 0 12px rgba(245,158,11,0.75)' }}>★</span>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-white">5.0</span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>· 500+ Google Reviews</span>
            </div>
          </div>
        </div>

      </section>

      {/* ════════════════════════════════════════════
          SECTION 2 — ABOUT WILL
      ════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 md:px-14 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-12" data-gsap="fade-up">
            <div className="h-px w-8" style={{ background: 'var(--color-cta)' }} />
            <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--color-cta)' }}>The Man Behind The Chair</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-gsap="fade-up">
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
                Will doesn't just<br />
                <span style={{ color: 'var(--color-accent)' }}>cut hair.</span>
              </h2>
              <div className="flex flex-col gap-5 text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                <p>He creates an experience. With nearly 600 five-star Google reviews and over 2,000 cuts documented across Instagram, TikTok, and Facebook, Another Planet Barbershop has become the go-to spot in Lansing for a reason.</p>
                <p>Specializing in flawless fades, kids premier haircuts, and every hair texture imaginable, Will brings energy, precision, and good vibes to every single client that sits in his chair. Another Planet is also government recommended for special needs children's haircuts, because everyone deserves a great cut.</p>
                <p>Come through, feel the vibe, and leave looking like the best version of yourself.</p>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-10">
                {[
                  { number: '600+', label: 'Five Star Reviews' },
                  { number: '2,000+', label: 'Cuts Documented' },
                  { number: '#1', label: 'Rated in Lansing' },
                ].map(({ number, label }) => (
                  <div key={label}>
                    <div className="text-3xl font-black" style={{ color: 'var(--color-accent)' }}>{number}</div>
                    <div className="text-xs mt-1 leading-tight" style={{ color: 'var(--color-text-dim)' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4" data-gsap="fade-up">
              {[
                { title: 'Government Recommended', desc: 'Certified for special needs children haircuts — trusted by families across Lansing.' },
                { title: 'Nearly 600 Five-Star Reviews', desc: "Google's own AI highlights Will as one of Lansing's best barbers. The reputation speaks for itself." },
                { title: 'Every Hair Type, Every Time', desc: 'Fades, tapers, kids cuts, shearwork — any texture, any style, done right.' },
                { title: 'Good Vibes Guaranteed', desc: 'Walk in as a client, leave as a regular. The atmosphere is half the experience.' },
              ].map(({ title, desc }) => (
                <div key={title} className="p-5 rounded-2xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                  <div className="font-bold text-sm text-white mb-1">{title}</div>
                  <div className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MarathonBanner />

      {/* ════════════════════════════════════════════
          SECTION 3 — REVIEWS + PORTFOLIO
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
                  onClick={() => goToBook()}
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
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.12)' }}>
                  <Scissors size={12} style={{ color: 'var(--color-cta)' }} />
                </div>
                <span className="font-bold text-sm">Book Your Appointment</span>
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                Tap below to view Will's availability and pick your time on Booksy.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href={BOOKSY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-full text-sm tracking-wide transition"
                  style={{ background: 'var(--color-cta)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-cta-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-cta)')}
                >
                  <CalendarDays size={14} />
                  Book on Booksy
                </a>
                <a
                  href={BOOKSY_URL}
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
          <div className="flex items-center gap-4">
            {[
              { href: 'https://www.instagram.com/anotherplanetwill/', label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
              { href: 'https://www.facebook.com/AnotherPlanetOfCutsandStyles', label: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              { href: 'https://www.tiktok.com/@anotherplanetbarberco', label: 'TikTok', path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
            ].map(({ href, label, path }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="transition-transform hover:scale-110"
                style={{ color: '#f97316', filter: 'drop-shadow(0 0 6px rgba(249,115,22,0.5))' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={path} /></svg>
              </a>
            ))}
          </div>
        </div>
      </footer>

      <ChatWidget />
    </main>
  )
}
