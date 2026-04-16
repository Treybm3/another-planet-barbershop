'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, X, Grid3X3 } from 'lucide-react'

const images = [
  { src: '/pic1.jpg',      alt: 'Clean Cut',       label: 'Precision Cut' },
  { src: '/pic2.jpg',      alt: 'Fade',             label: 'Skin Fade' },
  { src: '/pic3.jpg',      alt: 'Taper Fade',       label: 'Taper Fade' },
  { src: '/pic4.jpg',      alt: 'Cut',              label: 'Fresh Cut' },
  { src: '/pic5.jpg',      alt: 'Style',            label: 'Line Up' },
  { src: '/pic6.jpg',      alt: 'Fade',             label: 'Temp Fade' },
  { src: '/pic8.jpg',      alt: 'Cut',              label: 'Beard Trim' },
  { src: '/outerior.jpg',  alt: 'The Building',     label: 'Our Shop — Outside' },
  { src: '/outerior2.jpg', alt: 'The Building',     label: 'Our Shop — Outside' },
  { src: '/interior1.jpg', alt: 'Inside the Shop',  label: 'Inside the Shop' },
  { src: '/barberseat.jpg',alt: 'The Barber Chair', label: 'The Chair' },
]

const FADE_MS = 350
const AUTO_MS = 2000

export default function PortfolioGallery() {
  const [current,  setCurrent]  = useState(0)
  const [visible,  setVisible]  = useState(true)
  const [expanded, setExpanded] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const step = useCallback((dir: 1 | -1) => {
    if (reducedMotion) {
      setCurrent(c => (c + dir + images.length) % images.length)
      return
    }
    setVisible(false)
    setTimeout(() => {
      setCurrent(c => (c + dir + images.length) % images.length)
      setVisible(true)
    }, FADE_MS)
  }, [reducedMotion])

  function startTimer() {
    if (reducedMotion) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => step(1), AUTO_MS)
  }

  function handleArrow(dir: 1 | -1) {
    step(dir)
    startTimer()
  }

  function goTo(i: number) {
    if (i === current) return
    if (reducedMotion) { setCurrent(i); return }
    setVisible(false)
    setTimeout(() => { setCurrent(i); setVisible(true) }, FADE_MS)
    startTimer()
  }

  useEffect(() => {
    startTimer()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  // Close expanded with Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setExpanded(false) }
    if (expanded) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [expanded])

  const img = images[current]

  return (
    <>
      {/* ── Slideshow ── */}
      <div className="flex flex-col gap-5 w-full max-w-2xl">

        {/* Main image frame */}
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{ aspectRatio: '4/3', background: 'var(--color-surface)' }}
        >
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-full object-cover"
            style={{
              opacity: visible ? 1 : 0,
              transition: reducedMotion ? 'none' : `opacity ${FADE_MS}ms ease`,
            }}
          />

          {/* Label overlay bottom-left */}
          <div
            className="absolute bottom-0 left-0 right-0 px-5 py-4"
            style={{
              background: 'linear-gradient(to top, rgba(7,9,15,0.85) 0%, transparent 100%)',
              opacity: visible ? 1 : 0,
              transition: reducedMotion ? 'none' : `opacity ${FADE_MS}ms ease`,
            }}
          >
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--color-accent)' }}>
              {img.label}
            </span>
          </div>

          {/* Counter top-right */}
          <div
            className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(7,9,15,0.7)', color: 'var(--color-text-muted)' }}
          >
            {current + 1} / {images.length}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">

          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleArrow(-1)}
              aria-label="Previous"
              className="w-10 h-10 rounded-full flex items-center justify-center transition hover:scale-110 active:scale-95"
              style={{ background: 'var(--color-cta)', color: '#ffffff' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-cta-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-cta)')}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => handleArrow(1)}
              aria-label="Next"
              className="w-10 h-10 rounded-full flex items-center justify-center transition hover:scale-110 active:scale-95"
              style={{ background: 'var(--color-cta)', color: '#ffffff' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-cta-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-cta)')}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to photo ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? '20px' : '6px',
                  height: '6px',
                  background: i === current ? 'var(--color-accent)' : 'var(--color-text-dim)',
                }}
              />
            ))}
          </div>

          {/* View All button */}
          <button
            onClick={() => setExpanded(true)}
            className="flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase transition px-3 py-1.5 rounded-full border"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}
          >
            <Grid3X3 size={12} />
            View All
          </button>
        </div>
      </div>

      {/* ── Expanded grid modal ── */}
      {expanded && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          style={{ background: 'rgba(7,9,15,0.97)' }}
        >
          <div className="max-w-5xl mx-auto px-6 py-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase font-medium mb-1" style={{ color: 'var(--color-accent)' }}>Portfolio</p>
                <h3 className="text-2xl font-black">All Photos</h3>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="w-10 h-10 rounded-full border flex items-center justify-center transition"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); setExpanded(false); startTimer() }}
                  className="relative group rounded-xl overflow-hidden border transition"
                  style={{
                    aspectRatio: '1',
                    borderColor: i === current ? 'var(--color-accent)' : 'var(--color-border)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = i === current ? 'var(--color-accent)' : 'var(--color-border)')}
                >
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition group-hover:scale-105" />
                  <div
                    className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition"
                    style={{ background: 'linear-gradient(to top, rgba(7,9,15,0.9) 0%, transparent 60%)' }}
                  >
                    <span className="text-xs font-semibold" style={{ color: 'var(--color-accent)' }}>{img.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
