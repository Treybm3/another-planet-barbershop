'use client'

import { useState, useEffect } from 'react'
import { Eye, CalendarCheck, MessageCircle, ChevronDown } from 'lucide-react'

type DailyRow   = { date: string; views: number; booksy: number; chat: number }
type MonthlyRow = { month: string; views: number; booksy: number; chat: number }
type Analytics  = { totals: { views: number; booksy: number; chat: number }; daily: DailyRow[]; monthly: MonthlyRow[] }

function monthLabel(m: string) {
  return new Date(m + '-02').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function AdminPage() {
  const [analytics,    setAnalytics]    = useState<Analytics | null>(null)
  const [openYear,     setOpenYear]     = useState<string | null>(null)

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

  // Group monthly rows by year
  const byYear: Record<string, MonthlyRow[]> = {}
  for (const row of analytics?.monthly ?? []) {
    const yr = row.month.slice(0, 4)
    if (!byYear[yr]) byYear[yr] = []
    byYear[yr].push(row)
  }
  const years = Object.keys(byYear).sort().reverse()

  return (
    <main className="min-h-screen px-5 py-12" style={{ background: '#080808' }}>
      <div className="max-w-xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#f97316' }}>Another Planet Barbershop</p>
          <h1 className="text-3xl font-black text-white">Your Site Stats</h1>
          <p className="text-sm mt-1" style={{ color: '#52525b' }}>Updates every time someone visits, clicks, or chats.</p>
        </div>

        {/* Big stat cards */}
        <div className="flex flex-col gap-4">
          {[
            { label: 'People visited your site',  value: analytics?.totals.views,  icon: Eye,          color: '#60a5fa' },
            { label: 'Clicked to book on Booksy', value: analytics?.totals.booksy, icon: CalendarCheck, color: '#4ade80' },
            { label: 'Used the chat assistant',   value: analytics?.totals.chat,   icon: MessageCircle, color: '#f97316' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl p-6 border flex items-center gap-5" style={{ background: '#111', borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div className="flex-1">
                <div className="text-sm mb-1" style={{ color: '#71717a' }}>{label}</div>
                <div className="text-4xl font-black text-white">{value ?? '0'}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 7 day chart */}
        {analytics?.daily && analytics.daily.length > 0 && (
          <div className="rounded-2xl p-6 border" style={{ background: '#111', borderColor: 'rgba(255,255,255,0.06)' }}>
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
                      style={{ height: `${Math.max(pct, 5)}%`, background: pct > 0 ? '#f97316' : 'rgba(255,255,255,0.05)' }}
                    />
                    <div className="text-xs font-medium" style={{ color: '#52525b' }}>{label}</div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 pt-5 border-t grid grid-cols-2 gap-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="rounded-xl p-4" style={{ background: '#161616' }}>
                <p className="text-xs mb-1" style={{ color: '#52525b' }}>Booksy clicks today</p>
                <p className="text-2xl font-black" style={{ color: '#4ade80' }}>{analytics.daily[6]?.booksy ?? 0}</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: '#161616' }}>
                <p className="text-xs mb-1" style={{ color: '#52525b' }}>Chat opens today</p>
                <p className="text-2xl font-black" style={{ color: '#f97316' }}>{analytics.daily[6]?.chat ?? 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Monthly breakdown by year */}
        {years.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-white font-bold">Month by Month</p>
            <p className="text-xs -mt-2" style={{ color: '#52525b' }}>See how the site grows over time</p>

            {years.map(yr => (
              <div key={yr} className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <button
                  onClick={() => setOpenYear(openYear === yr ? null : yr)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  style={{ background: '#111' }}
                >
                  <span className="font-bold text-white text-lg">{yr}</span>
                  <ChevronDown
                    size={16}
                    style={{ color: '#52525b', transform: openYear === yr ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                  />
                </button>

                {openYear === yr && (
                  <div className="flex flex-col" style={{ background: '#0d0d0d' }}>
                    {[...byYear[yr]].reverse().map((row, i) => (
                      <div
                        key={row.month}
                        className="px-5 py-4 flex items-center justify-between"
                        style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                      >
                        <span className="text-sm font-semibold text-white">{monthLabel(row.month)}</span>
                        <div className="flex gap-4 text-xs" style={{ color: '#52525b' }}>
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
          Bookmark this page for quick access
        </p>
      </div>
    </main>
  )
}
