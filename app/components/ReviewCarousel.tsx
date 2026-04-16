'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const reviews = [
  {
    name: 'Dorrion McMurray',
    text: 'The best barber in Lansing hands down. I\'ve been coming to Kris for almost 10 years, I won\'t let anyone else cut my hair except him.',
    tag: 'Loyal client · 10 years',
  },
  {
    name: 'Shane Jordan',
    text: 'Kris is always so professional and makes you feel welcome. He\'s a safe space, and I always leave looking my best everytime.',
    tag: '$30–40',
  },
  {
    name: 'Devin Garza',
    text: 'Best barbers in Lansing work here! Kris is a real down to earth guy — real easy to talk to. Will get you right everytime.',
    tag: '$30–40',
  },
  {
    name: 'Julian Briggs',
    text: 'My guys get me right every time 😁 In and out service for myself and my two sons. These guys give back to the community — coaching basketball and football. Fourth annual Trunk or Treat in the parking lot this year!',
    tag: 'Community member',
  },
  {
    name: 'Chukuemeka Oje',
    text: 'Fantastic place for you and your kid to get a haircut. Both my son and I get our hair cut here and I am always happy with the results. Highly recommend!',
    tag: '$30–40',
  },
  {
    name: 'Meranda Petosky',
    text: 'Donte does an amazing job every time. He\'s patient, professional, and makes my son feel comfortable in the chair. Always clean and exactly what we ask for. 👌🏽',
    tag: '$20–30',
  },
  {
    name: 'Jade Bancroft',
    text: 'Dante is always professional, attentive, and takes his time. The cut always comes out exactly how my son wants it. Definitely recommend.',
    tag: '$20–30',
  },
  {
    name: 'Lance McClellan',
    text: 'I got a cut from Kaden. Great barber and very professional. Definitely would recommend.',
    tag: '$20–30',
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
