'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Eye, CalendarCheck, MessageCircle, ChevronDown } from 'lucide-react'
import VoidParticles from '../components/VoidParticles'

type DailyRow   = { date: string; views: number; booksy: number; chat: number }
type MonthlyRow = { month: string; views: number; booksy: number; chat: number }
type Analytics  = { totals: { views: number; booksy: number; chat: number }; daily: DailyRow[]; monthly: MonthlyRow[] }

function monthLabel(m: string) {
  return new Date(m + '-02').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [openYear,  setOpenYear]  = useState<string | null>(null)

  // Force reload if Safari restores from bfcache
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload()
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  useEffect(() => {
    fetch('/api/track', { cache: 'no-store' })
      .then(r => r.json())
      .then((data: Analytics) => {
        setAnalytics(data)
        if (data.monthly?.length) {
          const latest = data.monthly[data.monthly.length - 1].month.slice(0, 4)
          setOpenYear(latest)
        }
      })
      .catch(() => {})
  }, [])

  const maxViews = Math.max(...(analytics?.daily.map(d => d.views) ?? [1]), 1)

  const byYear: Record<string, MonthlyRow[]> = {}
  for (const row of analytics?.monthly ?? []) {
    const yr = row.month.slice(0, 4)
    if (!byYear[yr]) byYear[yr] = []
    byYear[yr].push(row)
  }
  const years = Object.keys(byYear).sort().reverse()

  const stats = [
    { label: 'Site Visits',        value: analytics?.totals.views,  icon: Eye,           color: '#60a5fa', glow: 'rgba(96,165,250,0.35)' },
    { label: 'Booksy Clicks',      value: analytics?.totals.booksy, icon: CalendarCheck,  color: '#4ade80', glow: 'rgba(74,222,128,0.35)' },
    { label: 'Chat Opens',         value: analytics?.totals.chat,   icon: MessageCircle,  color: '#f97316', glow: 'rgba(249,115,22,0.35)' },
  ]

  return (
    <main className="min-h-screen px-5 py-12" style={{ background: '#080808', position: 'relative', isolation: 'isolate' }}>
      <VoidParticles />

      <div className="relative z-10 max-w-xl mx-auto flex flex-col gap-8">

        {/* Header — logo + title */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="relative">
            <img
              src="/logo.jpg"
              alt="Another Planet Barbershop"
              className="w-20 h-20 rounded-full object-cover"
              style={{
                boxShadow: '0 0 0 3px rgba(245,158,11,0.35), 0 0 40px rgba(245,158,11,0.7), 0 0 80px rgba(245,158,11,0.25)',
              }}
            />
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.28em] uppercase mb-2" style={{ color: '#f97316' }}>
              Another Planet Barbershop
            </p>
            <h1 className="text-4xl font-black text-white leading-tight">Your Site Stats</h1>
            <p className="text-sm mt-2" style={{ color: '#52525b' }}>
              Updates every time someone visits, clicks, or chats.
            </p>
          </div>
        </div>

        {/* Main stat cards */}
        <div className="flex flex-col gap-4">
          {stats.map(({ label, value, icon: Icon, color, glow }) => (
            <div
              key={label}
              className="rounded-2xl p-6 flex items-center gap-5"
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, #0d0d0d 50%, rgba(8,8,8,0.98) 100%)',
                border: `1px solid ${glow.replace('0.35', '0.25')}`,
                boxShadow: `0 0 30px ${glow.replace('0.35', '0.08')}, inset 0 1px 0 ${glow.replace('0.35', '0.15')}`,
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `${color}15`, boxShadow: `0 0 20px ${glow}` }}
              >
                <Icon size={20} style={{ color, filter: `drop-shadow(0 0 6px ${color})` }} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: '#52525b' }}>{label}</div>
                <div
                  className="text-4xl sm:text-5xl font-black tabular-nums"
                  style={{ color, textShadow: `0 0 24px ${glow}, 0 0 48px ${glow.replace('0.35', '0.15')}` }}
                >
                  {value ?? '0'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 7-day chart */}
        {analytics?.daily && analytics.daily.length > 0 && (
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, #0d0d0d 60%, rgba(8,8,8,0.98) 100%)',
              border: '1px solid rgba(245,158,11,0.18)',
              boxShadow: '0 0 30px rgba(245,158,11,0.05)',
            }}
          >
            <p className="text-white font-bold mb-1">Last 7 Days</p>
            <p className="text-xs mb-6" style={{ color: '#52525b' }}>How many people hit the site each day</p>

            <div className="flex items-end gap-3 h-32">
              {analytics.daily.map((d) => {
                const pct   = Math.round((d.views / maxViews) * 100)
                const label = new Date(d.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })
                return (
                  <div key={d.date} className="flex flex-col items-center gap-2 flex-1">
                    <div className="text-sm font-bold text-white">{d.views > 0 ? d.views : ''}</div>
                    <div
                      className="w-full rounded-xl"
                      style={{
                        height: `${Math.max(pct, 5)}%`,
                        background: pct > 0
                          ? 'linear-gradient(to top, #f97316, #f59e0b)'
                          : 'rgba(255,255,255,0.04)',
                        boxShadow: pct > 0 ? '0 0 12px rgba(249,115,22,0.5)' : 'none',
                      }}
                    />
                    <div className="text-xs font-medium" style={{ color: '#52525b' }}>{label}</div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 pt-5 border-t grid grid-cols-2 gap-4" style={{ borderColor: 'rgba(245,158,11,0.1)' }}>
              <div className="rounded-xl p-4" style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.15)' }}>
                <p className="text-xs mb-1" style={{ color: '#52525b' }}>Booksy clicks today</p>
                <p className="text-2xl font-black" style={{ color: '#4ade80', textShadow: '0 0 16px rgba(74,222,128,0.6)' }}>
                  {analytics.daily[6]?.booksy ?? 0}
                </p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)' }}>
                <p className="text-xs mb-1" style={{ color: '#52525b' }}>Chat opens today</p>
                <p className="text-2xl font-black" style={{ color: '#f97316', textShadow: '0 0 16px rgba(249,115,22,0.6)' }}>
                  {analytics.daily[6]?.chat ?? 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Monthly breakdown */}
        {years.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-white font-bold">Month by Month</p>
            <p className="text-xs -mt-2" style={{ color: '#52525b' }}>See how the site grows over time</p>

            {years.map(yr => (
              <div
                key={yr}
                className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(245,158,11,0.15)' }}
              >
                <button
                  onClick={() => setOpenYear(openYear === yr ? null : yr)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  style={{ background: 'rgba(245,158,11,0.04)' }}
                >
                  <span className="font-bold text-white text-lg">{yr}</span>
                  <ChevronDown
                    size={16}
                    style={{ color: '#f59e0b', transform: openYear === yr ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                  />
                </button>

                {openYear === yr && (
                  <div className="flex flex-col" style={{ background: '#0a0a0a' }}>
                    {[...byYear[yr]].reverse().map((row, i) => (
                      <div
                        key={row.month}
                        className="px-5 py-4 flex items-center justify-between"
                        style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                      >
                        <span className="text-sm font-semibold text-white">{monthLabel(row.month)}</span>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs justify-end" style={{ color: '#52525b' }}>
                          <span><span className="font-bold" style={{ color: '#60a5fa' }}>{row.views}</span> visits</span>
                          <span><span className="font-bold" style={{ color: '#4ade80' }}>{row.booksy}</span> booksy</span>
                          <span><span className="font-bold" style={{ color: '#f97316' }}>{row.chat}</span> chats</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-center pb-4" style={{ color: '#27272a' }}>
          Bookmark this page · another-planet-barbershop.vercel.app/admin
        </p>
      </div>
    </main>
  )
}
