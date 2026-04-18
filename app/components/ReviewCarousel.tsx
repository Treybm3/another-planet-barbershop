'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const reviews = [
  {
    name: 'Gavin Mackinder',
    text: "Im not gonna lie if you like to look good this the place to go. He did an excellent job on my mid drop fade. Highly recommend! He makes sure you walk out of his shop happy. I will definitely be returning!",
  },
  {
    name: 'Joseph Michael',
    text: "Hands down one of the best barber shops I've been to. Super professional, clean environment, and the attention to detail is unmatched. My cut came out exactly how I wanted it. You can tell they really care about their craft. I'll definitely be coming back and recommending this place to everyone.",
  },
  {
    name: 'Caitlin Keusch',
    text: "I'm not usually a person who writes reviews, but I had to make an exception for Will! I have been thrilled by the quality of his work in the past few months I've been going to him. My hair can have a mind of its own sometimes, and I'm super particular about what I like, but I always walk out the door of his shop feeling good about myself. He is a total pro, a calming presence, and a genuinely kind man who lives to excel at his craft. ANYONE who's looking for a new barber should keep him in mind.",
  },
  {
    name: 'M W',
    text: "We were looking for a barber open on Sunday and came across Another Planet Barber Company. We were so thankful they took walk ins, got my son in right away and hooked him up excellent and quick! Thank you — he is 100% satisfied!",
  },
  {
    name: 'Rachel Kelley',
    text: "Worked quickly but efficiently. Hair cut came out just how we wanted, if not better! Very friendly and welcoming barber. Will definitely be a returning client.",
  },
  {
    name: 'Brooke Lyons',
    text: "Will did a great job on my son's hair. Moving here from Texas it was hard finding one we liked and safe to say will continue coming here in the future.",
  },
  {
    name: "Al'aina Rosas",
    text: "Please come to this shop! I got my fiancée's haircut done here and it came out great! The barber's name is Will and he's very talented and friendly.",
  },
]

const FADE = 280
const AUTO = 2000

export default function ReviewCarousel() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible]  = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const step = useCallback((dir: 1 | -1) => {
    if (reducedMotion) {
      setCurrent(c => (c + dir + reviews.length) % reviews.length)
      return
    }
    setVisible(false)
    setTimeout(() => {
      setCurrent(c => (c + dir + reviews.length) % reviews.length)
      setVisible(true)
    }, FADE)
  }, [reducedMotion])

  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => step(1), AUTO)
  }

  function handleArrow(dir: 1 | -1) {
    step(dir)
    startTimer()
  }

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const r = reviews[current]

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* Review card */}
      <div
        className="relative flex flex-col gap-4 min-h-[220px] py-2"
        style={{
          opacity: visible ? 1 : 0,
          transition: reducedMotion ? 'none' : `opacity ${FADE}ms ease`,
        }}
      >
        {/* Name + stars on top */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-base">{r.name}</div>
          </div>
          <span style={{ color: '#f59e0b' }}>★★★★★</span>
        </div>

        <Quote size={20} style={{ color: 'var(--color-accent)', opacity: 0.3 }} />

        <p className="text-base leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
          &ldquo;{r.text}&rdquo;
        </p>

        {/* Counter */}
        <div className="text-xs font-bold" style={{ color: 'var(--color-text-dim)' }}>
          {current + 1} / {reviews.length}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">

        {/* Arrows */}
        <div className="flex gap-2">
          <button
            onClick={() => handleArrow(-1)}
            aria-label="Previous review"
            className="w-10 h-10 rounded-full flex items-center justify-center transition hover:scale-110 active:scale-95"
            style={{ background: 'var(--color-cta)', color: '#ffffff' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-cta-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-cta)')}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => handleArrow(1)}
            aria-label="Next review"
            className="w-10 h-10 rounded-full flex items-center justify-center transition hover:scale-110 active:scale-95"
            style={{ background: 'var(--color-cta)', color: '#ffffff' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-cta-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-cta)')}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex gap-1.5 items-center">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => { step(i > current ? 1 : -1); setCurrent(i); startTimer() }}
              aria-label={`Go to review ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width:  i === current ? '18px' : '6px',
                height: '6px',
                background: i === current ? 'var(--color-accent)' : 'var(--color-text-dim)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
