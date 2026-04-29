'use client'

import { useState, useEffect } from 'react'
import { Flame } from 'lucide-react'

const COLORS = ['#f97316', '#f59e0b', '#fbbf24', '#fb923c', '#fde68a', '#e8dcc8', '#ffffff', '#fdba74']

type Piece = { id: number; x: number; delay: number; dur: number; color: string; w: number; h: number; rot: number }

export default function MarathonIntro() {
  const [phase,  setPhase]  = useState<'pop' | 'drop' | 'done'>('pop')
  const [pieces, setPieces] = useState<Piece[]>([])

  useEffect(() => {
    setPieces(
      Array.from({ length: 50 }, (_, i) => ({
        id:    i,
        x:     Math.random() * 100,
        delay: Math.random() * 1.4,
        dur:   Math.random() * 0.9 + 1.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        w:     Math.random() * 9  + 4,
        h:     Math.random() * 14 + 6,
        rot:   Math.random() * 360,
      }))
    )
    const t1 = setTimeout(() => setPhase('drop'), 3400)
    const t2 = setTimeout(() => setPhase('done'), 4500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase === 'done') return null

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">

      {/* Confetti */}
      {pieces.map(p => (
        <span
          key={p.id}
          className="absolute top-0"
          style={{
            left:      `${p.x}%`,
            width:     p.w,
            height:    p.h,
            background: p.color,
            borderRadius: 2,
            opacity:   0,
            animation: `anp-confetti ${p.dur}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}

      {/* Badge */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          animation: phase === 'drop'
            ? 'anp-badge-drop 1s cubic-bezier(0.55, 0, 0.65, 1) forwards'
            : 'anp-badge-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        }}
      >
        <div
          className="flex flex-col items-center gap-3 px-8 py-6 rounded-3xl text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(234,88,12,0.97), rgba(245,158,11,0.97))',
            boxShadow:  '0 0 60px rgba(245,158,11,0.65), 0 0 130px rgba(245,158,11,0.25), 0 24px 60px rgba(0,0,0,0.55)',
            border:     '1px solid rgba(255,255,255,0.22)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-white opacity-90" />
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-white opacity-75">
              June 2026 · Community Event
            </span>
            <Flame size={16} className="text-white opacity-90" />
          </div>

          <div
            className="text-4xl sm:text-5xl font-black text-white leading-none"
            style={{ textShadow: '0 2px 24px rgba(0,0,0,0.35)' }}
          >
            FREE CUT<br />MARATHON
          </div>

          <div className="text-sm font-semibold text-white opacity-65 tracking-wide">
            Another Planet Barbershop
          </div>
        </div>
      </div>

    </div>
  )
}
