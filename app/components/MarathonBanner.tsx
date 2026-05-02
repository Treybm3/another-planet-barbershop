'use client'

import { useState, useEffect } from 'react'
import { Flame, Users } from 'lucide-react'

const MARATHON_DATE = 'June 2026'
const LS_KEY        = 'anp_marathon_in'

function getToday() {
  return new Date().toLocaleDateString('en-US', {
    timeZone: 'America/Detroit', year: 'numeric', month: '2-digit', day: '2-digit',
  })
}

type Dot = { x: number; y: number; size: number; opacity: number; delay: number }

export default function MarathonBanner() {
  const [count,   setCount]   = useState<number | null>(null)
  const [clicked, setClicked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dots,    setDots]    = useState<Dot[]>([])

  useEffect(() => {
    if (localStorage.getItem(LS_KEY) === getToday()) setClicked(true)
    fetch('/api/marathon', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => setCount(d.count))
      .catch(() => setCount(0))
    setDots(
      Array.from({ length: 16 }, () => ({
        x:       Math.random() * 100,
        y:       Math.random() * 100,
        size:    Math.random() * 1.6 + 0.8,
        opacity: Math.random() * 0.25 + 0.08,
        delay:   Math.random() * 3,
      }))
    )
  }, [])

  async function handleClick() {
    if (clicked || loading) return
    setLoading(true)
    try {
      const res  = await fetch('/api/marathon', { method: 'POST' })
      const data = await res.json()
      setCount(data.count)
      setClicked(true)
      localStorage.setItem(LS_KEY, getToday())
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-12 md:py-16 px-6 md:px-14 border-t" style={{ borderColor: 'rgba(249,115,22,0.12)' }}>
      <div className="max-w-6xl mx-auto" data-gsap="fade-up">
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(249,115,22,0.07) 0%, #0a0a0a 40%, rgba(245,158,11,0.05) 100%)',
            border:     '1px solid rgba(245,158,11,0.16)',
            boxShadow:  '0 0 80px rgba(245,158,11,0.04)',
          }}
        >
          {/* Ambient dots */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
            {dots.map((d, i) => (
              <span
                key={i}
                className="absolute rounded-full animate-pulse"
                style={{
                  left:              `${d.x}%`,
                  top:               `${d.y}%`,
                  width:             `${d.size}px`,
                  height:            `${d.size}px`,
                  background:        `rgba(245,158,11,${d.opacity})`,
                  animationDelay:    `${d.delay}s`,
                  animationDuration: '3s',
                }}
              />
            ))}
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto]">

            {/* Left — text + button */}
            <div className="p-8 md:p-12">

              <div className="flex items-center gap-2 mb-6">
                <Flame size={12} style={{ color: '#f97316' }} />
                <span className="text-xs font-bold tracking-[0.28em] uppercase" style={{ color: '#f97316' }}>
                  Community Event · {MARATHON_DATE}
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-none mb-1" style={{ color: '#e8dcc8' }}>
                Free Cut
              </h2>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-black leading-none mb-7"
                style={{
                  color:      '#f59e0b',
                  textShadow: '0 0 40px rgba(245,158,11,0.55), 0 0 90px rgba(245,158,11,0.18)',
                }}
              >
                Marathon Day
              </h2>

              <p className="text-sm md:text-base max-w-md mb-8 leading-relaxed" style={{ color: '#71717a' }}>
                Will is giving back to the community — one full day of{' '}
                <span style={{ color: '#e8dcc8' }}>free cuts</span>.
                No appointment, no booking. Just show up.
              </p>

              <button
                onClick={handleClick}
                disabled={clicked || loading}
                className="relative flex items-center gap-2.5 font-bold px-9 py-4 rounded-full text-sm tracking-wide transition-all disabled:cursor-default"
                style={{
                  background: clicked
                    ? 'rgba(245,158,11,0.12)'
                    : 'linear-gradient(135deg, #f97316, #f59e0b)',
                  border:    '1px solid rgba(245,158,11,0.35)',
                  boxShadow: clicked ? 'none' : '0 0 28px rgba(249,115,22,0.28)',
                  color:     clicked ? '#f59e0b' : '#fff',
                }}
              >
                {!clicked && !loading && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-20"
                    style={{ background: '#f97316' }}
                  />
                )}
                <span className="relative">
                  {clicked ? '✓ You\'re In!' : loading ? '…' : 'Count Me In'}
                </span>
              </button>
            </div>

            {/* Right — live counter (always visible) */}
            <div
              className="flex flex-col items-center justify-center gap-2 p-8 md:p-12 lg:min-w-[200px] border-t lg:border-t-0 lg:border-l"
              style={{ borderColor: 'rgba(245,158,11,0.1)', background: 'rgba(245,158,11,0.025)' }}
            >
              <div className="flex items-center gap-1.5 mb-1" style={{ color: '#52525b' }}>
                <Users size={12} />
                <span className="text-[10px] tracking-[0.22em] uppercase">Today</span>
              </div>

              <div
                className="text-6xl md:text-7xl font-black tabular-nums leading-none"
                style={{
                  color:      '#f59e0b',
                  textShadow: '0 0 36px rgba(245,158,11,0.45)',
                  minWidth:   '2.5ch',
                  textAlign:  'center',
                }}
              >
                {count === null ? '—' : count}
              </div>

              <div className="text-xs text-center" style={{ color: '#52525b' }}>
                {count === 1 ? 'person interested' : 'people interested'}
              </div>

              <div
                className="mt-3 text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-full"
                style={{
                  background:  'rgba(245,158,11,0.07)',
                  color:       'rgba(245,158,11,0.45)',
                  border:      '1px solid rgba(245,158,11,0.1)',
                }}
              >
                Resets Daily
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
