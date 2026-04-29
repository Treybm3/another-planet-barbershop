'use client'

import { useState, useEffect } from 'react'
import { Zap, Users, Trophy } from 'lucide-react'

const MARATHON_DATE = 'June 2026'
const LS_KEY        = 'anp_marathon_in'

type Star = { x: number; y: number; size: number; opacity: number; delay: number }

export default function MarathonBanner() {
  const [count,   setCount]   = useState<number | null>(null)
  const [clicked, setClicked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stars,   setStars]   = useState<Star[]>([])

  useEffect(() => {
    if (localStorage.getItem(LS_KEY) === 'true') setClicked(true)
    fetch('/api/marathon', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => setCount(d.count))
      .catch(() => setCount(0))
    setStars(
      Array.from({ length: 22 }, () => ({
        x:       Math.random() * 100,
        y:       Math.random() * 100,
        size:    Math.random() * 1.8 + 0.8,
        opacity: Math.random() * 0.45 + 0.15,
        delay:   Math.random() * 2.5,
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
      localStorage.setItem(LS_KEY, 'true')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-12 md:py-16 px-6 md:px-14 border-t" style={{ borderColor: 'var(--color-border)' }}>
      <div className="max-w-6xl mx-auto" data-gsap="fade-up">
        <div
          className="relative rounded-3xl overflow-hidden p-8 md:p-12"
          style={{
            background: 'linear-gradient(135deg, rgba(168,85,247,0.13) 0%, rgba(8,8,8,0.97) 55%, rgba(88,28,135,0.09) 100%)',
            border: '1px solid rgba(168,85,247,0.22)',
            boxShadow: '0 0 80px rgba(168,85,247,0.07)',
          }}
        >
          {/* Star dots — client-only to avoid hydration mismatch */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
            {stars.map((s, i) => (
              <span
                key={i}
                className="absolute rounded-full animate-pulse"
                style={{
                  left:            `${s.x}%`,
                  top:             `${s.y}%`,
                  width:           `${s.size}px`,
                  height:          `${s.size}px`,
                  background:      `rgba(192,132,252,${s.opacity})`,
                  animationDelay:  `${s.delay}s`,
                  animationDuration: '2s',
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            {/* Left: text + button */}
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-5">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.22em] uppercase px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(168,85,247,0.14)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.28)' }}
                >
                  <Zap size={10} />
                  Community Event · {MARATHON_DATE}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-3">
                Free Cut<br />
                <span style={{ color: '#c084fc', textShadow: '0 0 32px rgba(192,132,252,0.35)' }}>Marathon Day</span>
              </h2>

              <p className="text-sm md:text-base max-w-md mb-7 leading-relaxed" style={{ color: 'rgba(255,255,255,0.52)' }}>
                Will is giving back to the community — one full day of{' '}
                <span style={{ color: 'rgba(255,255,255,0.85)' }}>free cuts</span>.
                No appointment needed. Just show up.
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={handleClick}
                  disabled={clicked || loading}
                  className="relative flex items-center gap-2 text-white font-bold px-8 py-3.5 rounded-full text-sm tracking-wide transition-all disabled:cursor-default"
                  style={{
                    background:  clicked ? 'rgba(168,85,247,0.28)' : '#a855f7',
                    border:      '1px solid rgba(168,85,247,0.45)',
                    boxShadow:   clicked ? 'none' : '0 0 28px rgba(168,85,247,0.38)',
                    transition:  'background 0.3s, box-shadow 0.3s',
                  }}
                >
                  {!clicked && !loading && (
                    <span
                      className="absolute inset-0 rounded-full animate-ping opacity-20"
                      style={{ background: '#a855f7' }}
                    />
                  )}
                  <span className="relative">
                    {clicked ? '✓ You\'re In!' : loading ? '…' : '🙋 Count Me In'}
                  </span>
                </button>

                {count !== null && (
                  <div className="flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
                    <Users size={13} />
                    <span className="text-sm">
                      <span className="font-bold" style={{ color: '#c084fc' }}>{count}</span>
                      {' '}{count === 1 ? 'person is' : 'people are'} interested today
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: date card */}
            <div
              className="shrink-0 flex flex-col items-center justify-center rounded-2xl p-7 text-center lg:min-w-[170px]"
              style={{ background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.18)' }}
            >
              <Trophy size={22} className="mb-3" style={{ color: '#c084fc' }} />
              <div className="text-[10px] tracking-[0.22em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.38)' }}>
                Mark Your Calendar
              </div>
              <div className="text-xl font-black mb-1" style={{ color: '#c084fc' }}>{MARATHON_DATE}</div>
              <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Another Planet Barbershop</div>
              <div className="text-[10px] mt-3 px-3 py-1 rounded-full" style={{ background: 'rgba(168,85,247,0.12)', color: 'rgba(192,132,252,0.6)' }}>
                Free · No Booking Needed
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
