'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronRight, Quote } from 'lucide-react'
import Navbar from '../components/Navbar'
import ChatWidget from '../components/ChatWidget'

gsap.registerPlugin(ScrollTrigger)

const reviews = [
  {
    name: 'Dorrion McMurray',
    review: 'The best barber in Lansing hands down. I\'ve been coming to Kris for almost 10 years, I won\'t let anyone else cut my hair except him.',
    tag: 'Loyal client · 10 years',
    size: 'large',
  },
  {
    name: 'Shane Jordan',
    review: 'Kris is always so professional and makes you feel welcome. He\'s a safe space, and I always leave looking my best everytime.',
    tag: '$30–40',
    size: 'medium',
  },
  {
    name: 'Devin Garza',
    review: 'Best barbers in Lansing work here! Kris is a real down to earth guy & a really good friend of mine! Real easy to talk to. Will get you right everytime.',
    tag: '$30–40',
    size: 'medium',
  },
  {
    name: 'Julian Briggs',
    review: 'My guys get me right every time 😁 In and out services for myself and my two sons. These guys actually give back to our community — both barbers coaching basketball and football. Fourth annual Trunk or Treat in the parking lot this year!',
    tag: 'Community member',
    size: 'large',
  },
  {
    name: 'Chukuemeka Oje',
    review: 'Fantastic place for you and your kid to get a haircut. Both my son and I get our hair cut here and I am always happy with the results. Highly recommend Kris Professional Cuts as your go-to place!',
    tag: '$30–40',
    size: 'medium',
  },
  {
    name: 'Meranda Petosky',
    review: 'Donte does an amazing job every time. He\'s patient, professional, and makes my son feel comfortable in the chair. The haircut is always clean and exactly what we ask for. Definitely recommend! 👌🏽',
    tag: '$20–30',
    size: 'medium',
  },
  {
    name: 'Jade Bancroft',
    review: 'Dante is always professional, attentive, and takes his time. The cut always comes out exactly how my son wants it. Definitely recommend.',
    tag: '$20–30',
    size: 'small',
  },
  {
    name: 'Lance McClellan',
    review: 'I got a cut from Kaden. Great barber and very professional. Definitely would recommend.',
    tag: '$20–30',
    size: 'small',
  },
]

export default function AboutPage() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis()
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

  return (
    <main style={{ background: 'var(--color-bg)' }} className="min-h-screen text-white">
      <Navbar />

      {/* ── Page header ── */}
      <section className="pt-36 pb-16 px-8 md:px-14">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div data-gsap="fade-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8" style={{ background: 'var(--color-accent)' }} />
              <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--color-accent)' }}>
                Page 02
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              Meet the<br />
              <span style={{ color: 'var(--color-accent)' }}>Team.</span>
            </h1>
          </div>
          <p className="text-sm max-w-xs leading-relaxed md:text-right" style={{ color: 'var(--color-text-muted)' }} data-gsap="fade-up">
            Real barbers, real community,<br />real results — every time.
          </p>
        </div>
      </section>

      {/* ── About Kris — asymmetric layout ── */}
      <section className="py-16 px-8 md:px-14 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-6xl mx-auto">

          {/* Offset grid — image takes more width on left */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 items-start mb-20" data-gsap="fade-up">

            {/* Left — shop photo */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '3/4', background: 'var(--color-surface)' }}>
                <img src="/kris cuts.jpg" alt="Kris at work" className="w-full h-full object-cover" />
              </div>
              {/* Floating stat card */}
              <div
                className="absolute -bottom-6 -right-4 md:-right-8 px-5 py-4 rounded-xl border shadow-xl"
                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                <div className="text-2xl font-black">10+</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Years of craft</div>
              </div>
            </div>

            {/* Right — bio */}
            <div className="lg:pt-8">
              <p className="text-xs tracking-[0.3em] uppercase font-medium mb-4" style={{ color: 'var(--color-accent)' }}>The Owner</p>
              <h2 className="text-4xl font-black mb-6 leading-tight">
                Kris.<br />
                <span className="text-2xl font-semibold" style={{ color: 'var(--color-text-muted)' }}>Master Barber</span>
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: 'var(--color-text-muted)' }}>
                Kris Professional Cuts isn't just a barbershop — it's a community. Kris has been cutting
                hair in Lansing for over a decade, building relationships that go beyond the chair.
                Clients don't just come back for the cut; they come back because this is their space.
              </p>
              <p className="leading-relaxed mb-8" style={{ color: 'rgba(148,163,184,0.6)' }}>
                Outside the shop, Kris and his team give back — coaching youth basketball and football,
                and hosting the annual Trunk or Treat in the parking lot. This is what community looks like.
              </p>

              {/* Stats row — asymmetric spacing */}
              <div className="flex items-start gap-8 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <div>
                  <div className="text-3xl font-black">★★★★★</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Google rating</div>
                </div>
                <div>
                  <div className="text-3xl font-black">3</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Skilled barbers</div>
                </div>
                <div>
                  <div className="text-3xl font-black">4th</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Annual Trunk or Treat</div>
                </div>
              </div>
            </div>
          </div>

          {/* The team */}
          <div data-gsap="fade-up" className="mt-16 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8" style={{ background: 'var(--color-accent)' }} />
              <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--color-accent)' }}>The Barbers</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Kris',  role: 'Owner · Master Barber',  desc: 'Specializes in fades and precision cuts. 10+ years building client relationships.' },
                { name: 'Donte', role: 'Barber',                  desc: 'Patient and detail-oriented. Known for making kids comfortable in the chair.' },
                { name: 'Kaden', role: 'Barber',                  desc: 'Professional and skilled. Clients consistently recommend his work.' },
              ].map((b, i) => (
                <div
                  key={b.name}
                  className="p-6 rounded-2xl border flex flex-col gap-3"
                  style={{
                    background: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    marginTop: i === 1 ? '1.5rem' : '0',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-black border-2"
                    style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)', background: 'rgba(59,130,246,0.08)' }}
                  >
                    {b.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{b.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--color-accent)' }}>{b.role}</div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews — asymmetric masonry-style ── */}
      <section className="py-20 px-8 md:px-14 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-6xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14" data-gsap="fade-up">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8" style={{ background: 'var(--color-accent)' }} />
                <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--color-accent)' }}>Google Reviews</span>
              </div>
              <h2 className="text-4xl font-black">What Clients Say.</h2>
            </div>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Real reviews. Real clients. Real results.</p>
          </div>

          {/* Asymmetric 2-column layout with varied card heights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Left column */}
            <div className="flex flex-col gap-5">
              {reviews.filter((_, i) => i % 2 === 0).map((r) => (
                <article
                  key={r.name}
                  className="p-6 rounded-2xl border flex flex-col gap-4"
                  style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                  data-gsap="fade-up"
                >
                  <Quote size={20} style={{ color: 'var(--color-accent)', opacity: 0.5 }} />
                  <p
                    className="leading-relaxed flex-1"
                    style={{
                      color: 'var(--color-text-muted)',
                      fontSize: r.size === 'large' ? '1rem' : '0.875rem',
                    }}
                  >
                    &ldquo;{r.review}&rdquo;
                  </p>
                  <footer className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <div>
                      <div className="text-sm font-bold">{r.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{r.tag}</div>
                    </div>
                    <span className="text-sm" style={{ color: 'var(--color-accent)' }}>★★★★★</span>
                  </footer>
                </article>
              ))}
            </div>

            {/* Right column — offset slightly */}
            <div className="flex flex-col gap-5 md:mt-10">
              {reviews.filter((_, i) => i % 2 === 1).map((r) => (
                <article
                  key={r.name}
                  className="p-6 rounded-2xl border flex flex-col gap-4"
                  style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                  data-gsap="fade-up"
                >
                  <Quote size={20} style={{ color: 'var(--color-accent)', opacity: 0.5 }} />
                  <p
                    className="leading-relaxed flex-1"
                    style={{
                      color: 'var(--color-text-muted)',
                      fontSize: r.size === 'large' ? '1rem' : '0.875rem',
                    }}
                  >
                    &ldquo;{r.review}&rdquo;
                  </p>
                  <footer className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <div>
                      <div className="text-sm font-bold">{r.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{r.tag}</div>
                    </div>
                    <span className="text-sm" style={{ color: 'var(--color-accent)' }}>★★★★★</span>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA to portfolio ── */}
      <section className="py-16 px-8 md:px-14 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-3xl font-black mb-2">Ready to see the work?</h3>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Browse the portfolio and book your appointment.</p>
          </div>
          <Link
            href="/portfolio"
            className="flex items-center gap-2 text-white font-bold px-8 py-4 rounded-full text-sm tracking-wide transition shrink-0"
            style={{ background: 'var(--color-accent)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-accent-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-accent)')}
          >
            View Portfolio <ChevronRight size={15} />
          </Link>
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
