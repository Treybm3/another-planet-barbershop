'use client'

import { useState, useEffect } from 'react'
import { Scissors, Eye, CalendarCheck, MessageCircle, TrendingUp } from 'lucide-react'

type DailyRow = { date: string; views: number; booksy: number; chat: number }
type Analytics = { totals: { views: number; booksy: number; chat: number }; daily: DailyRow[] }

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)

  useEffect(() => {
    fetch('/api/track', { cache: 'no-store' })
      .then(r => r.json())
      .then(setAnalytics)
      .catch(() => {})
  }, [])

  const maxViews = Math.max(...(analytics?.daily.map(d => d.views) ?? [1]), 1)

  return (
    <main className="min-h-screen px-4 py-10" style={{ background: '#080808' }}>
      <div className="max-w-lg mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#f97316' }}>
            <Scissors size={16} className="text-white" />
          </div>
          <span className="text-white font-bold tracking-wide">Another Planet · Dashboard</span>
        </div>

        {/* Totals */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} style={{ color: '#f97316' }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#f97316' }}>Site Performance</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Site Visits',   value: analytics?.totals.views  ?? '—', icon: Eye,          color: '#60a5fa' },
              { label: 'Booksy Clicks', value: analytics?.totals.booksy ?? '—', icon: CalendarCheck, color: '#4ade80' },
              { label: 'Chat Opens',    value: analytics?.totals.chat   ?? '—', icon: MessageCircle, color: '#f97316' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-2xl p-4 flex flex-col gap-2 border" style={{ background: '#111', borderColor: 'rgba(255,255,255,0.06)' }}>
                <Icon size={14} style={{ color }} />
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="text-xs leading-tight" style={{ color: '#52525b' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 7-day bar chart */}
        {analytics?.daily && analytics.daily.length > 0 && (
          <div className="rounded-2xl p-5 border" style={{ background: '#111', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#52525b' }}>Last 7 Days — Site Visits</div>
            <div className="flex items-end gap-2 h-24">
              {analytics.daily.map((d) => {
                const pct = Math.round((d.views / maxViews) * 100)
                const label = new Date(d.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })
                return (
                  <div key={d.date} className="flex flex-col items-center gap-1 flex-1">
                    <div className="text-xs font-bold text-white">{d.views > 0 ? d.views : ''}</div>
                    <div
                      className="w-full rounded-t-lg transition-all"
                      style={{ height: `${Math.max(pct, 4)}%`, background: pct > 0 ? '#f97316' : 'rgba(255,255,255,0.06)' }}
                    />
                    <div className="text-xs" style={{ color: '#52525b' }}>{label}</div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 pt-4 border-t flex gap-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2 text-xs" style={{ color: '#52525b' }}>
                <span className="w-2 h-2 rounded-full" style={{ background: '#4ade80' }} />
                Booksy clicks today: <span className="text-white font-bold">{analytics.daily[6]?.booksy ?? 0}</span>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: '#52525b' }}>
                <span className="w-2 h-2 rounded-full" style={{ background: '#f97316' }} />
                Chat opens today: <span className="text-white font-bold">{analytics.daily[6]?.chat ?? 0}</span>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-center" style={{ color: '#3f3f46' }}>
          Bookmark this page on your phone for quick access
        </p>
      </div>
    </main>
  )
}
